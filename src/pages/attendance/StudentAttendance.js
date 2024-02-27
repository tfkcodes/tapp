import { Box, Button } from "@mui/material";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Switch from "@mui/material/Switch";

export function StudentAttendanceModal(props) {
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
      "STD_I",
      "STD_II",
      "STD_III",
      "STD_IV",
      "STD_V",
      "STD_VI",
      "STD_VII",
    ],
    Secondary: ["Form_I", "Form_II", "Form_III", "Form _V"],
    Advanced: ["Form_V", "Form_VI"],
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
        : `${BASE_URL}api/attendance/student`;
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

export function StudentAttendance(props) {
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

  const openStudentAttendanceModal = (data = {}) => {
    const component = (
      <StudentAttendanceModal modal={modal} refresh={refresh} data={data} />
    );
    modal.current.show("Library Books", component, "50%");
  };

  const handleFilterChange = (field, value) => {
    setParams({ ...params, [field]: value });
  };

  const handleSubmit = () => {
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("api/attendance/student", {
        params: params, // Send filter options as query parameters
      });
      // Handle the response data
      console.log("Fetched data:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Student Attendance"}
        actionButton={false}
        label={"Class Attendance"}
      />

      <AlertBar ref={alert} />
      <>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 1,
            m: 1,
            flexWrap: "nowrap",
          }}
        >
          <SelectInputField
            label={"Education Level"}
            value={params.level}
            onChange={(value) => handleFilterChange("level", value)}
            options={[
              { label: "Nursery", value: "Nursery" },
              { label: "Primary", value: "Primary" },
              { label: "Secondary", value: "Secondary" },
              { label: "A Level", value: "Advanced" },
              { label: "Collage / University", value: "Collage" },
            ]}
          />
          <SelectInputField
            label={"Class"}
            value={params.className}
            onChange={(value) => handleFilterChange("className", value)}
            options={[
              // Provide options for classes based on the selected education level
              ...(params.level === "Nursery"
                ? [
                    { label: "Kindergarten", value: "Kindergarten" },
                    { label: "Chekechea", value: "Chekechea" },
                  ]
                : []),
              ...(params.level === "Primary"
                ? [
                    { label: "STD_I", value: "STD_I" },
                    { label: "STD_II", value: "STD_II" },
                    { label: "STD_III", value: "STD_III" },
                    { label: "STD_IV", value: "STD_IV" },
                    { label: "STD_V", value: "STD_V" },
                    { label: "STD_VI", value: "STD_VI" },
                    { label: "STD_VII", value: "STD_VII" },
                  ]
                : []),
              ...(params.level === "Secondary"
                ? [
                    { label: "Form I", value: "Form I" },
                    { label: "Form II", value: "Form II" },
                    { label: "Form III", value: "Form III" },
                    { label: "Form IV", value: "Form IV" },
                  ]
                : []),
              ...(params.level === "Advanced"
                ? [
                    { label: "Form V", value: "Form V" },
                    { label: "Form VI", value: "Form VI" },
                  ]
                : []),
            ]}
          />
          <SelectInputField
            label={"Section"}
            value={params.section}
            onChange={(value) => handleFilterChange("section", value)}
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "CBG", value: "CBG" },
              { label: "HGL", value: "HGL" },
              { label: "HGK", value: "HGK" },
              { label: "PGM", value: "PGM" },
              { label: "PCM", value: "PCM" },
            ]}
          />
        </Box>
      </>
      <Table
        title={""}
        url={"api/attendance/student"}
        params={params}
        columns={[
          {
            id: "regNo",
            label: "Student ID",
            customRender: true,
            valueGetter: (item) => item?.regNo,
          },
          {
            id: "name",
            label: "Student Name",
            customRender: true,
            valueGetter: (item) => item?.name,
          },
          {
            id: "level",
            label: "Education Level",
            customRender: true,
            valueGetter: (item) => item?.level,
          },
          {
            id: "className",
            label: "Class",
            customRender: true,
            valueGetter: (item) => item?.className,
          },
          {
            id: "section",
            label: "Class Section",
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
