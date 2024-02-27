import { Box } from "@mui/material";
import { useRef, useState } from "react";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import ModalPage from "../../components/ModalPage";
import CheckBoxInput from "../../components/CheckBoxInput";
import { BASE_URL } from "../../constants";
import Form from "../../components/Form";
import { reportErrors } from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import SelectInputField from "../../components/SelectInputField";

import { useNavigate } from "react-router-dom";

import Switch from "@mui/material/Switch";

export function TeacherAttendanceModal(props) {
  const alert = useRef();
  const form = useRef();

  const [canSubmit, setCanSubmit] = useState(true);
  const [educationLevel, setEducationLevel] = useState(
    props?.data?.level || ""
  );
  const [classLevel, setClassLevel] = useState(props?.data?.classLevel || "");
  const [classSection, setClassSection] = useState(
    props?.data?.classSection || ""
  );

  const educationLevelOptions = [
    { label: "Nursery", value: "Nursery" },
    { label: "Primary", value: "Primary" },
    { label: "Secondary", value: "Secondary" },
    { label: "A Level", value: "Advanced" },
    { label: "Collage / University", value: "Collage" },
  ];

  const classLevelOptions = {
    Nursery: ["Kindergarten", "Chekechea"],
    Primary: [
      "STD I",
      "STD II",
      "STD III",
      "STD IV",
      "STD V",
      "STD VI",
      "STD VII",
    ],
    Secondary: ["Form I", "Form II", "Form III", "Form IV"],
    Advanced: ["Form V", "Form VI"],
  };

  const classSectionOptions = {
    Secondary: ["A", "B", "C"],
    Advanced: ["CBG", "HGL", "HGK", "PGM", "PCM"],
  };

  const handleEducationLevelChange = (value) => {
    setEducationLevel(value);
    // Set classLevel and classSection based on the selected education level
    if (value) {
      setClassLevel(props?.data?.classLevel || classLevelOptions[value][0]);
      setClassSection(props?.data?.classSection || "");
    } else {
      // If no education level is selected, reset both classLevel and classSection
      setClassLevel("");
      setClassSection("");
    }
  };

  const handleModalFormSubmit = () => {
    const data = {
      classLevel,
      classSection,
      educationLevel,
    };
    if (form.current.validate()) {
      setCanSubmit(false);
      const requestUrl = props.data?.feeId
        ? `${BASE_URL}api/setup/fees/${props.data?.feeId}`
        : `${BASE_URL}api/attendance/teacher`;
      const requestMethod = props.data?.feeId ? "put" : "get";
      window.axios[requestMethod](requestUrl, data)
        .then((response) => {
          alert.current.showSuccess(
            `${props.data?.feeId ? "Update" : "Apply"} Successfully.`
          );
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
  };

  return (
    <Box>
      <AlertBar ref={alert} />
      <Form ref={form}>
        <SelectInputField
          label={"Education Level"}
          required={true}
          options={educationLevelOptions}
          value={educationLevel}
          onChange={(value) => handleEducationLevelChange(value)}
        />
        {educationLevel && (
          <>
            <SelectInputField
              label={"Class Level"}
              required={true}
              options={classLevelOptions[educationLevel]}
              value={classLevel}
              onChange={(value) => setClassLevel(value)}
            />
            {educationLevel === "Secondary" && classLevel && (
              <SelectInputField
                label={"Class Section"}
                required={true}
                options={classSectionOptions[educationLevel]}
                value={classSection}
                onChange={(value) => setClassSection(value)}
              />
            )}
          </>
        )}
        <ActionButtonField
          disabled={!canSubmit}
          color={"primary"}
          label={props?.data?.id ? "Update" : "Apply"}
          onClick={() => handleModalFormSubmit()}
        />
      </Form>
    </Box>
  );
}

export function TeacherAttendance(props) {
  const alert = useRef();
  const modal = useRef();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [params, setParams] = useState({
    name: undefined,
    section: undefined,
    class: undefined,
    level: undefined,

    refresh: true,
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const openTeacherAttendanceModal = (data = {}) => {
    const component = (
      <TeacherAttendanceModal modal={modal} refresh={refresh} data={data} />
    );
    modal.current.show("Library Books", component, "50%");
  };

  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Student Attendance"}
        actionButton={true}
        label={"Class Attendance"}
        onClick={() => openTeacherAttendanceModal()}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/attendance/teacher"}
        params={params}
        columns={[
          {
            id: "regNo",
            label: "Teacher ID",
            customRender: true,
            valueGetter: (item) => item?.regNo,
          },
          {
            id: "name",
            label: "Teacher Name",
            customRender: true,
            valueGetter: (item) => item?.name,
          },
          {
            id: "Subject",
            label: "Teacher Subject",
            customRender: true,
            valueGetter: (item) => item?.section,
          },
          {
            id: "action",
            label: "Status",
            disabled: true,
            customRender: true,
            valueGetter: (item) => (
              <Switch
                checked={checked}
                onChange={(event) => handleChange(event)}
                name="checked"
                color="primary"
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
