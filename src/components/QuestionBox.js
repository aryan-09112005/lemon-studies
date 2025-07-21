import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

const QuestionBox = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (question.trim()) {
      onSubmit(question);
      setQuestion("");
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
      <TextField
        label="Ask a quesion"
        fullWidth
        multiline
        rows={2}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default QuestionBox;
