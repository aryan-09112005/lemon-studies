// src/components/VideoCard.js
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const VideoCard = ({ title, videoId, src }) => {
  const isYouTube = Boolean(videoId);

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        mb: 2,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      {isYouTube ? (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allowFullScreen
        />
      ) : (
        <video
          controls
          style={{
            width: "100%",
            height: "200px", // Same as iframe
            objectFit: "cover", // Crops to fill space like thumbnail
            background: "#000",
          }}
          src={src}
        />
      )}
      <CardContent sx={{ textAlign: "center", py: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
