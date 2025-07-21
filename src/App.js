// src/App.js
import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  InputAdornment,
  ThemeProvider,
  CssBaseline,
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
  Card,
  Snackbar,
  Alert,
  Dialog,            // <-- added
  DialogTitle,       // <-- added
  DialogContent,     // <-- added
  DialogActions,     // <-- added
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UndoIcon from "@mui/icons-material/Undo";

import Chapter from "./components/Chapter";
import chaptersData from "./data/chapters";
import qaData from "./data/qaData";
import theme from "./theme/theme";

// ✅ Added ExampleComponent
import ExampleComponent from "./ExampleComponent";

// *** ADDED FOR ADMIN LOGIN ***
const ADMIN_CREDENTIALS = { username: "admin", password: "12345" }; // change!

// ----- localStorage key -----
const STORAGE_KEY_UPLOADED = "uploadedVideos_v1";

// ----- helper: file -> base64 data URL -----
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

const renderBrandTitle = () => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <img
      src="/image.png"
      alt="Lemon Robotics Logo"
      style={{
        height: "70px",
        width: "auto",
        objectFit: "contain",
        userSelect: "none",
        pointerEvents: "none",
        display: "block",
      }}
    />
  </Box>
);

const TAB_INDEX = {
  VIDEOS: 0,
  FORMULAS: 1,
  ABOUT: 2,
  HISTORY: 3,
  CONTACT: 4,
  ASK: 5,
  APPLY: 6,
};

export default function App() {
  // ----- state -----
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState(TAB_INDEX.VIDEOS);

  const [questions, setQuestions] = useState(qaData);
  const [showAnswers, setShowAnswers] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [tutorData, setTutorData] = useState({
    name: "",
    email: "",
    subject: "",
    experience: "",
    message: "",
  });

  // built‑in (YouTube) videos
  const [chapterList, setChapterList] = useState(chaptersData);

  // uploaded (data URL) videos
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const [uploadError, setUploadError] = useState("");

  // undo
  const [removedItem, setRemovedItem] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // *** ADDED FOR ADMIN LOGIN ***
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // *** ADDED FOR FORGOT PASSWORD ***
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  // ----- load uploads from localStorage -----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_UPLOADED);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const cleaned = Array.isArray(parsed)
        ? parsed
            .filter((v) => v && v.id && v.src)
            .map((v) => ({ ...v, isUploaded: true }))
        : [];
      setUploadedVideos(cleaned);
    } catch {
      /* ignore */
    }
  }, []);

  // *** ADDED FOR ADMIN LOGIN *** load admin session from localStorage
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []);

  // ----- persist uploads -----
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_UPLOADED, JSON.stringify(uploadedVideos));
  }, [uploadedVideos]);

  // ----- handlers -----
  const handleTabChange = (_e, newValue) => setTab(newValue);

  const allVideos = useMemo(
    () => [...chapterList, ...uploadedVideos],
    [chapterList, uploadedVideos]
  );
  const filteredVideos = allVideos.filter((v) =>
    (v.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuestionSubmit = () => {
    if (!newQuestion.trim()) return;
    setQuestions((prev) => [
      ...prev,
      { question: newQuestion.trim(), answer: "Answer coming soon..." },
    ]);
    setNewQuestion("");
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowed = ["video/mp4", "video/webm", "video/ogg"];
    const valid = files.filter((f) => allowed.includes(f.type));
    if (!valid.length) {
      setUploadError("Please upload valid video files (MP4, WebM, or Ogg).");
      return;
    }
    setUploadError("");

    const vids = [];
    for (const file of valid) {
      try {
        const dataUrl = await fileToDataURL(file);
        vids.push({
          id: Date.now() + Math.random(),
          title: file.name,
          src: dataUrl,
          isUploaded: true,
          type: file.type,
          size: file.size,
        });
      } catch {}
    }

    if (vids.length) setUploadedVideos((prev) => [...prev, ...vids]);

    e.target.value = "";
  };

  const handleRemoveVideo = (id) => {
    let removed = null;

    setUploadedVideos((prev) => {
      const vid = prev.find((v) => v.id === id);
      if (!vid) return prev;
      removed = { type: "upload", video: vid };
      return prev.filter((v) => v.id !== id);
    });

    setChapterList((prev) => {
      if (removed) return prev;
      const chap = prev.find((c) => c.id === id);
      if (!chap) return prev;
      removed = { type: "chapter", chapter: chap };
      return prev.filter((c) => c.id !== id);
    });

    if (removed) {
      setRemovedItem(removed);
      setShowUndo(true);
    }
  };

  const handleUndoRemove = () => {
    if (!removedItem) return;
    if (removedItem.type === "chapter") {
      setChapterList((prev) => [...prev, removedItem.chapter]);
    } else if (removedItem.type === "upload") {
      setUploadedVideos((prev) => [...prev, removedItem.video]);
    }
    setRemovedItem(null);
    setShowUndo(false);
  };

  const handleUndoClose = (_event, reason) => {
    if (reason === "clickaway") return;
    setShowUndo(false);
    setRemovedItem(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginForm.username === ADMIN_CREDENTIALS.username &&
      loginForm.password === ADMIN_CREDENTIALS.password
    ) {
      setIsAdmin(true);
      setLoginError("");
      localStorage.setItem("isAdmin", "true");
    } else {
      setLoginError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  const openForgotDialog = () => {
    setForgotOpen(true);
    setForgotEmail("");
    setForgotError("");
  };
  const closeForgotDialog = () => {
    setForgotOpen(false);
    setForgotError("");
  };
  const handleForgotSend = () => {
    const email = forgotEmail.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!email || !ok) {
      setForgotError("Enter a valid email.");
      return;
    }
    alert(`Password reset link would be sent to ${email} (demo).`);
    closeForgotDialog();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {!isAdmin ? (
        <Container
          maxWidth="sm"
          sx={{
            mt: 12,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
            backdropFilter: "blur(6px)",
          }}
        >
          {renderBrandTitle()}
          <Typography variant="h4" sx={{ mt: 2, mb: 3, fontWeight: "bold" }}>
            Premium Access
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Admin login required to access Lemon Studies content.
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              autoComplete="username"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm((f) => ({ ...f, username: e.target.value }))
              }
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              autoComplete="current-password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((f) => ({ ...f, password: e.target.value }))
              }
              sx={{ mb: 1.5, backgroundColor: "white", borderRadius: 1 }}
            />
            {loginError && (
              <Typography color="error" sx={{ mb: 1.5 }}>
                {loginError}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ fontWeight: 600, py: 1.2, mb: 1 }}
            >
              Login
            </Button>
          </form>

          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={openForgotDialog}
          >
            Forgot Password?
          </Typography>

          <Dialog open={forgotOpen} onClose={closeForgotDialog}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                Enter the email associated with your admin account.
              </Typography>
              <TextField
                label="Email"
                type="email"
                fullWidth
                autoFocus
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                error={Boolean(forgotError)}
                helperText={forgotError || " "}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={closeForgotDialog}>Cancel</Button>
              <Button variant="contained" onClick={handleForgotSend}>
                Send Reset Link
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      ) : (
        <>
          <AppBar
            position="static"
            elevation={2}
            sx={{ bgcolor: "#f5f5f5", color: "black" }}
          >
            <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
              {renderBrandTitle()}
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="error"
                size="small"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Logout
              </Button>
            </Toolbar>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="Navigation Tabs"
              sx={{ borderBottom: "1px solid #ddd" }}
            >
              <Tab label="Videos" />
              <Tab label="Formulas" />
              <Tab label="About" />
              <Tab label="History" />
              <Tab label="Contact" />
              <Tab label="Ask a Question" />
              <Tab label="Apply as Tutor" />
            </Tabs>
          </AppBar>

          <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3 } }}>
            {/* -------------------- VIDEOS TAB -------------------- */}
            {tab === TAB_INDEX.VIDEOS && (
              <Box
                sx={{
                  background: "linear-gradient(180deg, #e8f5e9 0%, #f1f8e9 100%)",
                  borderRadius: 3,
                  p: { xs: 2, sm: 4 },
                }}
              >
                {/* Upload */}
                <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                    Upload Your Own Videos
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 3, color: "text.secondary" }}
                  >
                    Upload MP4/WebM/Ogg files. They will appear in the list
                    below with all other videos (small files only).
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Select Videos
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      hidden
                      multiple
                      onChange={handleVideoUpload}
                    />
                  </Button>
                  {uploadError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {uploadError}
                    </Typography>
                  )}
                </Card>

                {/* Search */}
                <TextField
                  label="Search videos"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
                />

                {/* Unified Grid: built‑in + uploads */}
                <Chapter
                  chapters={filteredVideos}
                  enableRemove
                  onRemoveVideo={handleRemoveVideo}
                />

                {/* ExampleComponent added here */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    API Test
                  </Typography>
                  <ExampleComponent />
                </Box>

                {/* Q&A */}
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    Questions & Answers
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAnswers(!showAnswers)}
                  >
                    {showAnswers ? "Hide Answers" : "Show Answers"}
                  </Button>
                  {questions.map((q, i) => (
                    <Box key={i} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1">
                        Q{i + 1}: {q.question}
                      </Typography>
                      {showAnswers && <Typography>A: {q.answer}</Typography>}
                    </Box>
                  ))}
                  <TextField
                    fullWidth
                    label="Ask a question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    sx={{ mt: 2, mb: 2, backgroundColor: "white" }}
                  />
                  <Button variant="contained" onClick={handleQuestionSubmit}>
                    Submit
                  </Button>
                </Box>
              </Box>
            )}

            {/* -------------------- FORMULAS TAB -------------------- */}
            {tab === TAB_INDEX.FORMULAS && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Important Chemistry Formulas
                </Typography>
                <ul>
                  <li>
                    <b>Molarity (M)</b> = Moles of Solute / Volume of Solution (L)
                  </li>
                  <li>
                    <b>Molality (m)</b> = Moles of Solute / Mass of Solvent (kg)
                  </li>
                  <li>
                    <b>Moles</b> = Given Mass / Molar Mass
                  </li>
                  <li>
                    <b>Density</b> = Mass / Volume
                  </li>
                  <li>
                    <b>pH</b> = -log₁₀[H⁺]
                  </li>
                  <li>
                    <b>PV = nRT</b> (Ideal Gas Law)
                  </li>
                </ul>
              </Box>
            )}

            {/* -------------------- ABOUT TAB -------------------- */}
            {tab === TAB_INDEX.ABOUT && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  About Lemon Studies
                </Typography>
                <Typography>
                  Lemon Studies provides quality Chemistry learning for Class 10
                  with engaging videos, notes, and quizzes to ensure strong
                  conceptual understanding.
                </Typography>
              </Box>
            )}

            {/* -------------------- HISTORY TAB -------------------- */}
            {tab === TAB_INDEX.HISTORY && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Our Journey
                </Typography>
                <Typography>
                  Started in 2025, Lemon Studies aims to make science
                  interesting and accessible to all students.
                </Typography>
              </Box>
            )}

            {/* -------------------- CONTACT TAB -------------------- */}
            {tab === TAB_INDEX.CONTACT && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Contact Us
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <Button variant="contained">Submit</Button>
              </Box>
            )}

            {/* -------------------- ASK TAB -------------------- */}
            {tab === TAB_INDEX.ASK && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Ask Any Question
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Submit your queries and we will respond soon.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Your Question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" onClick={handleQuestionSubmit}>
                  Submit
                </Button>
              </Box>
            )}

            {/* -------------------- APPLY TAB -------------------- */}
            {tab === TAB_INDEX.APPLY && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Apply as Tutor
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  value={tutorData.name}
                  onChange={(e) =>
                    setTutorData({ ...tutorData, name: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={tutorData.email}
                  onChange={(e) =>
                    setTutorData({ ...tutorData, email: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  value={tutorData.subject}
                  onChange={(e) =>
                    setTutorData({ ...tutorData, subject: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Experience"
                  value={tutorData.experience}
                  onChange={(e) =>
                    setTutorData({ ...tutorData, experience: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Message"
                  value={tutorData.message}
                  onChange={(e) =>
                    setTutorData({ ...tutorData, message: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <Button variant="contained">Submit</Button>
              </Box>
            )}
          </Container>
        </>
      )}

      {/* Undo Snackbar */}
      <Snackbar
        open={showUndo}
        autoHideDuration={5000}
        onClose={handleUndoClose}
        message="Video removed"
        action={
          <Button
            color="secondary"
            size="small"
            startIcon={<UndoIcon />}
            onClick={handleUndoRemove}
          >
            UNDO
          </Button>
        }
      />
    </ThemeProvider>
  );
}
