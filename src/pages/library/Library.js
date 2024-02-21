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

export function LibraryBookModal(props) {
  const alert = useRef();
  const form = useRef();

  const nameInput = useRef();

  const authorInput = useRef();
  const locationInput = useRef();
  const genderInput = useRef();
  const levelInput = useRef();
  const copiesInput = useRef();

  const [name, setName] = useState(props?.data?.name || undefined);
  const [canSubmit, setCanSubmit] = useState(true);
  const [author, setAuthor] = useState(props?.data?.author || "");
  const [location, setLocation] = useState(props?.data?.location || "");
  const [gender, setGender] = useState(props?.data?.gender || "");
  const [educationLevel, setLevel] = useState(props?.data?.level || "");
  const [copies, setCopies] = useState(props?.data?.copies || "");

  const ModalForm = () => {
    const copiesNumber = parseInt(copies);
    if (isNaN(copiesNumber)) {
      alert.current.showError("Copies must be a valid number.");
      return;
    }
    let data = {
      name,
      author,
      location,
      gender,
      level: educationLevel,
      copies: copiesNumber,
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
          .post(`${BASE_URL}api/library/add-library-book`, data)
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
          label={"Book Name"}
          required={true}
          value={name}
          onChange={(value) => setName(value)}
        />
        <TextInputField
          ref={authorInput}
          label={"Book Author"}
          required={true}
          value={author}
          onChange={(value) => setAuthor(value)}
        />

        <TextInputField
          ref={locationInput}
          label={"Book Location"}
          required={true}
          value={location}
          onChange={(value) => setLocation(value)}
        />
        <SelectInputField
          ref={genderInput}
          label={"Gender"}
          required={true}
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ]}
          onChange={(value) => setGender(value)}
        />
        <SelectInputField
          ref={levelInput}
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
        <TextInputField
          ref={copiesInput}
          label={"Total Copies"}
          required={true}
          value={copies}
          onChange={(value) => setCopies(value)}
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

export function LibraryBooks(props) {
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

  const LibraryBookModals = (data = {}) => {
    let component = (
      <LibraryBookModal modal={modal} refresh={refresh} data={data} />
    );
    modal.current.show("Library Books", component, "50%");
  };
  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Library Books"}
        actionButton={true}
        label={"Add Book"}
        onClick={() => LibraryBookModals()}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/library/books"}
        params={params}
        columns={[
          {
            id: "name",
            label: "Book Name",
            customRender: true,
            valueGetter: (item) => capitalize(item?.name),
          },
          {
            id: "author",
            label: "Book Author",
            customRender: true,
            valueGetter: (item) => item?.author,
          },
          {
            id: "level",
            label: "Book Level",
            customRender: true,
            valueGetter: (item) => item?.level,
          },
          {
            id: "location",
            label: "Book Location",
            customRender: true,
            valueGetter: (item) => item?.location,
          },

          {
            id: "copies",
            label: "Copies",
            customRender: true,
            valueGetter: (item) => item?.copies,
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
        onRawClick={() => {}}
      />
      <ModalPage ref={modal} />
    </Box>
  );
}
