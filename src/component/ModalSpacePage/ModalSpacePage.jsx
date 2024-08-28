import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Container,
} from "@mui/material";
import "./ModalSpacePage.css";
import loaderGif from "../../assets/loader.gif"; //

const ModelSpacePage = () => {
  const { id } = useParams();
  const [modelSpace, setModelSpace] = useState(null);
  const [formData, setFormData] = useState({});
  const [outputData, setOutputData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/model-spaces/${id}`)
      .then((response) => {
        setModelSpace(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching model space details:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [name]: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    setError(null);
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/model-spaces/${id}/predict`,
        formData
      )
      .then((response) => setOutputData(response.data.data))
      .catch((error) => setError("Error during prediction: " + error.message));
  };

  const renderOutput = (output) => {
    if (typeof output === "string" && output.startsWith("https://")) {
      return (
        <img
          src={output}
          alt="Generated Output"
          style={{ maxWidth: "100%", marginBottom: "20px" }}
        />
      );
    } else if (typeof output === "string" && output.startsWith("data:audio")) {
      return (
        <audio controls src={output} style={{ marginBottom: "20px" }}>
          Your browser does not support the audio element.
        </audio>
      );
    } else if (typeof output === "string") {
      return (
        <Typography variant="body1" style={{ marginBottom: "20px" }}>
          {output}
        </Typography>
      );
    } else if (Array.isArray(output)) {
      return output.map((item, index) => renderOutput(item));
    } else {
      return (
        <pre style={{ marginBottom: "20px" }}>
          {JSON.stringify(output, null, 2)}
        </pre>
      );
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <img src={loaderGif} alt="Loading..." className="loader" />
      </div>
    );
  }

  return (
    <Container className="model-space-page">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" className="page-title">
            {modelSpace.name}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ m: 0, mt: 2 }}>
        <Grid item xs={12} md={6} className="card-border">
          <div className="card">
            <div className="card-content">
              <div className="input-form">
                <form onSubmit={handleSubmit}>
                  {modelSpace.inputs.map((input) => {
                    switch (input.type) {
                      case "text":
                      case "number":
                        return (
                          <TextField
                            key={input.name}
                            label={input.description}
                            name={input.name}
                            type={input.type}
                            fullWidth
                            margin="normal"
                            required={input.required}
                            onChange={handleChange}
                            variant="outlined"
                          />
                        );
                      case "bool":
                        return (
                          <FormControlLabel
                            key={input.name}
                            control={
                              <Switch
                                checked={!!formData[input.name]}
                                onChange={handleChange}
                                name={input.name}
                                color="primary"
                              />
                            }
                            label={input.description}
                          />
                        );
                      case "audio":
                      case "image":
                        return (
                          <div
                            key={input.name}
                            style={{ marginBottom: "16px" }}
                          >
                            <Typography
                              variant="body1"
                              gutterBottom
                              style={{ color: "#AFAFAF" }}
                            >
                              {input.description}
                            </Typography>
                            <input
                              accept={input.type + "/*"}
                              type="file"
                              name={input.name}
                              required={input.required}
                              onChange={handleChange}
                            />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                  <Button type="submit" variant="contained" color="primary">
                    Predict
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {outputData && (
            <div className="output-section">
              <Typography variant="h6" className="output-title">
                Output
              </Typography>
              {Object.keys(outputData).map((key, index) => (
                <div key={index} className="output-message-card">
                  <Typography variant="subtitle1" gutterBottom>
                    {key}:
                  </Typography>
                  {renderOutput(outputData[key])}
                </div>
              ))}
            </div>
          )}

          {error && <Typography color="error">{error}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ModelSpacePage;
