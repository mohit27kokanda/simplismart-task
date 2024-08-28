import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Skeleton,
} from "@mui/material";
import "./HomePage.css";

const HomePage = () => {
  const [modelSpaces, setModelSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/model-spaces`)
      .then((response) => {
        setModelSpaces(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching model spaces:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="home-page">
      <Typography variant="h4" gutterBottom className="page-title">
        Available Model Spaces
      </Typography>
      <Grid container spacing={3} sx={{ pb: 4 }}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="model-card">
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="90%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : modelSpaces.map((space) => (
              <Grid item xs={12} sm={6} md={4} key={space.id}>
                <Link
                  to={`/model-space/${space.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    className="model-card"
                    sx={{ backgroundColor: "#1a1a40" }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={space.avatar}
                      alt={space.name}
                      className="card-image"
                    />
                    <CardContent>
                      <Typography variant="h5" className="card-title">
                        {space.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="card-description"
                      >
                        {space.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
