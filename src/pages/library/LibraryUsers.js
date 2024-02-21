import { Box } from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import { capitalize, convertISODateToDate } from "../../helpers";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPage from "../../components/ModalPage";
import CheckBoxInput from "../../components/CheckBoxInput";
import TextInputField from "../../components/TextInputField";
import { BASE_URL } from "../../constants";
import Form from "../../components/Form";
import { reportErrors } from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import SelectInputField from "../../components/SelectInputField";
import DateTimeField from "../../components/DateTimeField";

export function LibraryUserModal(props) {
  const alert = useRef();
  const form = useRef();

  const nameInput = useRef();

  const regNoInput = useRef();
  const educationLevelInput = useRef();
  const timeInInput = useRef();
  const timeOutInput = useRef();

  const [name, setName] = useState(props?.data?.name || undefined);
  const [canSubmit, setCanSubmit] = useState(true);
  const [regNo, setRegNo] = useState(props?.data?.regNo || "");
  const [timeIn, setTimeIn] = useState(props?.data?.timeIn || "");
  const [timeOut, setTimeOut] = useState(props?.data?.timeOut || "");
  const [educationLevel, setLevel] = useState(props?.data?.level || "");

  const ModalForm = () => {
    let data = {
      name,
      regNo,
      level: educationLevel,
      timeIn,
      timeOut,
    };
    if (form.current.validate()) {
      setCanSubmit(false);
      if (props.data?.feeId) {
        window.axios
          .put(`${BASE_URL}api/setup/fees/${props.data?.feeId}`, data)
          .then((response) => {
            alert.current.showSuccess("Update Successfully.");
            setCanSubmit(true);
            setTimeout(() => {
              props.modal.current.hide();
              props.refresh();
            }, 1000);
          })
          .catch((error) => {
            setCanSubmit(true);
            reportErrors(alert.current, error);
          });
      } else {
        window.axios
          .post(`${BASE_URL}api/library/add-library-user`, data)
          .then((response) => {
            alert.current.showSuccess("Create Successfully.");
            setCanSubmit(true);
            setTimeout(() => {
              props.modal.current.hide();
              props.refresh();
            }, 1000);
          })
          .catch((error) => {
            setCanSubmit(true);
            reportErrors(alert.current, error);
          });
      }
    }
  };

  return (
    <Box>
      <AlertBar ref={alert} />
      <Form ref={form}>
        <TextInputField
          ref={nameInput}
          label={"Full Name"}
          required={true}
          value={name}
          onChange={(value) => setName(value)}
        />
        <TextInputField
          ref={regNoInput}
          label={"Registration Number"}
          required={true}
          value={regNo}
          onChange={(value) => setRegNo(value)}
        />

        <SelectInputField
          ref={educationLevelInput}
          label={"Education Level"}
          required={true}
          options={[
            { label: "Nursery", value: "Nursery" },
            { label: "Primary", value: "Primary" },
            { label: "Secondary", value: "Secondary" },
            { label: "A Level", value: "Advanced" },
            { label: "Collage / University", value: "Collage" },
          ]}
          onChange={(value) => setLevel(value)}
        />

        <DateTimeField
          ref={timeInInput}
          label={"Time In"}
          required={true}
          value={timeIn}
          onChange={(value) => setTimeIn(value)}
        />

        <DateTimeField
          ref={timeOutInput}
          label={"Time Out"}
          required={true}
          value={timeOut}
          onChange={(value) => setTimeOut(value)}
        />
        <ActionButtonField
          disabled={!canSubmit}
          color={"primary"}
          label={props?.data?.id ? "Update" : "Save"}
          onClick={() => ModalForm()}
        />
      </Form>
    </Box>
  );
}

export function LibraryUsers(props) {
  const alert = useRef();
  const navigate = useNavigate();
  const modal = useRef();
  const [checked, setChecked] = useState();
  const [params, setParams] = useState({
    name: undefined,
    author: undefined,
    level: undefined,
    location: undefined,
    copies: undefined,
    refresh: true,
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const LibraryUserModals = (data = {}) => {
    let component = (
      <LibraryUserModal modal={modal} refresh={refresh} data={data} />
    );
    modal.current.show("Library Users", component, "50%");
  };
  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Library Users"}
        actionButton={true}
        label={"Add Library User"}
        onClick={() => LibraryUserModals()}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/library/library-users"}
        params={params}
        columns={[
          {
            id: "name",
            label: "Full Name ",
            customRender: true,
            valueGetter: (item) => capitalize(item?.name),
          },
          {
            id: "regNo",
            label: "Registration Number",
            customRender: true,
            valueGetter: (item) => item?.regNo,
          },
          {
            id: "level",
            label: "Education Level",
            customRender: true,
            valueGetter: (item) => item?.level,
          },
          {
            id: "timeIn",
            label: "Time In",
            customRender: true,
            valueGetter: (item) => item?.timeIn,
          },
          {
            id: "timeOut",
            label: "Time Out",
            customRender: true,
            valueGetter: (item) => item?.timeOut,
          },
          {
            id: "action",
            label: "Action",
            disabled: true,
            customRender: true,
            valueGetter: (item) => (
              <CheckBoxInput
                checked={checked}
                handleChange={(event) => handleChange(event)}
              />
            ),
          },
        ]}
        onRawClick={(item) => navigate(`details/${item?.userId}`)}
      />
      <ModalPage ref={modal} />
    </Box>
  );
}
