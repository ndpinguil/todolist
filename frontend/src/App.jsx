import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { blue, purple, orange } from "@mui/material/colors";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = () => {
    setLoading(true);
    axios.get("http://localhost:5001/tasks").then((res) => {
      setTasks(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    if (newTask.trim() === "") return;
    axios
      .post("http://localhost:5001/tasks", { title: newTask })
      .then(() => {
        fetchTasks();
        setNewTask("");
      });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5001/tasks/${id}`).then(() => {
      fetchTasks();
    });
  };

  const editTask = (task) => {
    setNewTask(task.title);
    setEditingTask(task.id);
  };

  const updateTask = () => {
    axios
      .put(`http://localhost:5001/tasks/${editingTask}`, { title: newTask })
      .then(() => {
        fetchTasks();
        setNewTask("");
        setEditingTask(null);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 6, backgroundColor: blue[50] }}>
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, backgroundColor: purple[50] }}>
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          color={orange[600]}
          fontWeight="bold"
        >
          Task Manager
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          mb={3}
          sx={{
            backgroundColor: purple[100],
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <TextField
            label={editingTask ? "Update Task" : "Enter a New Task"}
            variant="filled"
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={editingTask ? updateTask : addTask}
            startIcon={editingTask ? <EditIcon /> : <AddCircleOutlineIcon />}
            sx={{
              alignSelf: "flex-start",
              backgroundColor: orange[600],
              "&:hover": { backgroundColor: orange[700] },
            }}
          >
            {editingTask ? "Save Changes" : "Add Task"}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" mb={2}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} key={task.id}>
                <Card sx={{ backgroundColor: purple[200], borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      {task.title}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <IconButton
                        onClick={() => editTask(task)}
                        color="primary"
                        sx={{ fontSize: 20 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteTask(task.id)}
                        color="error"
                        sx={{ fontSize: 20 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

export default App;
