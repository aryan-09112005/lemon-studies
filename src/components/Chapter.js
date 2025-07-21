// src/components/Chapter.js
import React from "react";
import { Grid, Card, CardContent, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoCard from "./VideoCard";

/**
 * chapters: Array of
 *   built-in: {id,title,videoId}
 *   uploaded: {id,title,src,isUploaded:true}
 *
 * enableRemove: boolean
 * onRemoveVideo: (id) => void
 */
export default function Chapter({ chapters = [], enableRemove = false, onRemoveVideo }) {
  return (
    <Grid container spacing={2}>
      {chapters.map((ch) => (
        <Grid item xs={12} sm={6} md={4} key={ch.id}>
          <Card sx={{ position: "relative", borderRadius: 3, overflow: "hidden" }}>
            {enableRemove && (
              <IconButton
                size="small"
                color="error"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                  zIndex: 1,
                }}
                onClick={() => onRemoveVideo?.(ch.id)}
                aria-label="Remove video"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}

            {/* Use VideoCard to render either YouTube or uploaded */}
            <VideoCard title={ch.title} videoId={ch.videoId} src={ch.src} />

            {/* Optional description under card (some chapter data might have it) */}
            {ch.description && (
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  {ch.description}
                </Typography>
              </CardContent>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
