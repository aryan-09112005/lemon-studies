import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

const ChapterCard = ({ n, title, videoId, pdfUrl }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {n}. {title}
        </Typography>
        <Box sx={{ position: "relative", pt: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen
          ></iframe>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
        >
          Watch
        </Button>
        <Button href={pdfUrl} target="_blank" variant="contained">
          Download PDF
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChapterCard;
