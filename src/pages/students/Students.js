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
import useFetch from "../../hooks/useFetch";

export function StudentModal(props) {
  const alert = useRef();
  const form = useRef();

  const nameInput = useRef();

  const emailInput = useRef();
  const phoneInput = useRef();
  const genderInput = useRef();
  const dobInput = useRef();
  const programIdInput = useRef();
  const levelInput = useRef();
  const academicYearInput = useRef();

  const [name, setName] = useState(props?.data?.name || undefined);
  const [canSubmit, setCanSubmit] = useState(true);
  const [email, setEmail] = useState(props?.data?.email || "");
  const [phone, setPhone] = useState(props?.data?.phone || "");
  const [programName, setProgramName] = useState();
  const [academicYearName, setAcademicYearName] = useState();
  const [academicYearStartDate, setAcademicYearStartDate] = useState("");
  const [academicYearEndDate, setAcademicYearEndDate] = useState("");

  const [programId, setProgramId] = useState(
    props?.data?.programId || undefined
  );
  const [academicYearId, setAcademicYearId] = useState(
    props?.data?.academicYearId || undefined
  );

  const [dob, setDob] = useState(props?.data?.dob || "");
  const [gender, setGender] = useState(props?.data?.gender || "");

  const [educationLevel, setLevel] = useState(props?.data?.level || "");
  const { data: programs } = useFetch(
    "api/setup/program",
    {
      page: 1,
      limit: 25,
      name: programName,
    },
    true,
    [],
    (response) =>
      response.data.data.map((e) => {
        return { value: e.departmentId, label: e.name, ...e };
      })
  );

  const { data: academicYears } = useFetch(
    "api/setup/academic-year",
    {
      page: 1,
      limit: 25,
      name: academicYearName,
    },
    true,
    [],
    (response) =>
      response.data.data.map((e) => {
        return {
          value: e.academicYearId,
          label: e.name,
          startDate: e.startDate,
          endDate: e.endDate,
          ...e,
        };
      })
  );
  const ModalForm = () => {
    let data = {
      name,
      phone,
      email,
      gender,

      dob,
      scheme: "Student",
      level: educationLevel,
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
          .post(`${BASE_URL}api/student/register-student`, data)
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
          ref={phoneInput}
          label={"Phone number"}
          required={true}
          value={phone}
          onChange={(value) => setPhone(value)}
        />
        <TextInputField
          ref={emailInput}
          label={"Email address"}
          required={true}
          value={email}
          onChange={(value) => setEmail(value)}
        />
        <SelectInputField
          ref={programIdInput}
          label={"Program"}
          required={true}
          options={programs}
          value={programId}
          onKeyDown={(value) => setProgramName(value)}
          onChange={(value) => setProgramId(value)}
        />
        <SelectInputField
          ref={academicYearInput}
          label={"Adamic Year"}
          required={true}
          options={academicYears}
          value={academicYearId}
          onKeyDown={(value) => setAcademicYearName(value)}
          onChange={(value) => setAcademicYearId(value)}
        />
        <DateTimeField
          ref={dobInput}
          label={"Date of Birth"}
          required={true}
          value={dob}
          onChange={(value) => setDob(value)}
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
        {/* <SelectInputField
          ref={academicYearInput}
          label={"Academic Year"}
          required={true}
          options={[
            { label: "2020", value: "2020" },
            { label: "2020", value: "2020" },
            { label: "2021", value: "2021" },
            { label: "2021", value: "2021" },
          ]}
          onChange={(value) => setAcademicYear(value)}
        /> */}

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
export default function Students(props) {
  const alert = useRef();
  const navigate = useNavigate();
  const modal = useRef();
  const [checked, setChecked] = useState();
  const [params, setParams] = useState({
    name: undefined,
    phone: undefined,
    email: undefined,
    refresh: true,
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const StudentsModal = (data = {}) => {
    let component = (
      <StudentModal modal={modal} refresh={refresh} data={data} />
    );
    modal.current.show("Students", component, "50%");
  };

  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Students"}
        actionButton={true}
        label={"Add Student"}
        onClick={() => StudentsModal()}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/student/student"}
        params={params}
        columns={[
          {
            id: "name",
            label: "Full Name",
            customRender: true,
            valueGetter: (item) => capitalize(item?.name),
          },
          {
            id: "gender",
            label: "Gender",
            customRender: true,
            valueGetter: (item) => item?.gender,
          },
          {
            id: "phone",
            label: "Phone",
            customRender: true,
            valueGetter: (item) => item?.phone,
          },
          {
            id: "dob",
            label: "Date of Birth",
            customRender: true,
            valueGetter: (item) => convertISODateToDate(item?.dob),
          },
          {
            id: "studentNumber",
            label: "Student Number",
            customRender: true,
            valueGetter: (item) => item?.studentNumber,
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
