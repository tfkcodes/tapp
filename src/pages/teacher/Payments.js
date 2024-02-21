import { Box } from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";

export default function Payments(props) {
  return (
    <Box>
      <HeaderDisplay title={"Payments"} actionButton={false} />
    </Box>
  );
}
