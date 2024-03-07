import { Box, Container, Grid } from "@mui/material";
import Header from "../../components/Header";
import Footer from "./Footer";

const sections = [
  { title: "Nursery", url: "#" },
  { title: "Primary", url: "#" },
  { title: "Secondary", url: "#" },
  { title: "A Level", url: "#" },
  { title: "Collage / University", url: "#" },
];

export default function HomeLayout(props) {
  return (
    <Box sx={{ background: "#f6f7f7" }}>
      <Container maxWidth={"xl"} sx={{ mt: 2 }}>
        <Header sections={sections} title={"TAPP Schools"} />
        <main
          style={{
            backgroundSize: "cover",
          }}
        >
          {props.children}
        </main>
        <Footer description={""} title={""} />
      </Container>
    </Box>
  );
}
