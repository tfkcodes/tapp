import { Box, Button } from "@mui/material";
import { useRef, useState } from "react";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import ModalPage from "../../components/ModalPage";
import { BASE_URL } from "../../constants";
import Form from "../../components/Form";
import { reportErrors } from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import SelectInputField from "../../components/SelectInputField";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Switch from "@mui/material/Switch";
import Confirmation from "../../components/Confirmation";

export function StudentAttendanceModal({ data, modal, refresh }) {
  const alert = useRef();
  const form = useRef();
  const [canSubmit, setCanSubmit] = useState(true);
  const [formData, setFormData] = useState({
    educationLevel: data?.level || "",
    classLevel: data?.classLevel || "",
    classSection: data?.classSection || "",
  });

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
    Secondary: ["Form I", "Form_II", "Form_III", "Form_IV"],
    Advanced: ["Form_V", "Form_VI"],
  };

  const classSectionOptions = {
    Secondary: ["A", "B", "C"],
    Advanced: ["CBG", "HGL", "HGK", "PGM", "PCM"],
  };

  const handleEducationLevelChange = (value) => {
    setFormData({
      ...formData,
      educationLevel: value,
      classLevel: value ? classLevelOptions[value][0] : "",
      classSection: "",
    });
  };

  const handleModalFormSubmit = () => {
    if (form.current.validate()) {
      setCanSubmit(false);
      const requestUrl = data?.feeId
        ? `${BASE_URL}api/setup/fees/${data?.feeId}`
        : `${BASE_URL}api/attendance/student`;
      const requestMethod = data?.feeId ? "put" : "post";
      window.axios[requestMethod](requestUrl, formData)
        .then(() => {
          alert.current.showSuccess(
            `${data?.feeId ? "Update" : "Apply"} Successfully.`
          );
          setCanSubmit(true);
          setTimeout(() => {
            modal.current.hide();
            refresh();
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
          value={formData.educationLevel}
          onChange={handleEducationLevelChange}
        />
        {formData.educationLevel && (
          <>
            <SelectInputField
              label={"Class Level"}
              required={true}
              options={classLevelOptions[formData.educationLevel]}
              value={formData.classLevel}
              onChange={(value) =>
                setFormData({ ...formData, classLevel: value })
              }
            />
            {formData.educationLevel === "Secondary" && (
              <SelectInputField
                label={"Class Section"}
                required={true}
                options={classSectionOptions[formData.educationLevel]}
                value={formData.classSection}
                onChange={(value) =>
                  setFormData({ ...formData, classSection: value })
                }
              />
            )}
          </>
        )}
        <ActionButtonField
          disabled={!canSubmit}
          color={"primary"}
          label={data?.id ? "Update" : "Apply"}
          onClick={handleModalFormSubmit}
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
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [params, setParams] = useState({
    level: undefined,
    className: undefined,
    section: undefined,
    refresh: true,
  });

  const handleFilterChange = (field, value) => {
    setParams({ ...params, [field]: value });
  };

  const handleTakeAttendance = (id) => {
    console.log("User id", id);

    modal.current.show(
      "Mark Present",
      <Confirmation
        message={`Mark this student as present`}
        handleOk={() => markPresent(id)}
        handleClose={() => modal.current.hide()}
      />,
      "30%"
    );
    console.log("Taking attendance for", selectedUsers);
  };

  const handleTakeAttendanceAbs = (id) => {
    console.log("User id", id);

    modal.current.show(
      "Mark Absent",
      <Confirmation
        message={`Mark this student as Absent`}
        handleOk={() => markAbsent(id)}
        handleClose={() => modal.current.hide()}
      />,
      "30%"
    );
    console.log("Taking attendance for", selectedUsers);
  };
  const markPresent = (id) => {
    const attendance_date = new Date().toISOString();
    const status = "Present";
    const userId = id;

    const data = {
      attendance_date,
      status,
      userId,
    };
    window.axios
      .post(`${BASE_URL}api/attendance/take-attendance-student`, data)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          alert.current.showSuccess("Present updated successfully");
          modal.current.hide();
          props.refresh();
        } else {
          throw new Error("Failed to update status");
        }
      })
      .catch((error) => {
        alert.current.showError(error.message);
      });
  };
  const markAbsent = (id) => {
    const attendance_date = new Date().toISOString();
    const status = "Absent";
    const userId = id;

    const data = {
      attendance_date,
      status,
      userId,
    };
    window.axios
      .post(`${BASE_URL}api/attendance/take-attendance-student`, data)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          alert.current.showSuccess("Present updated successfully");
          modal.current.hide();

          props.refresh();
        } else {
          throw new Error("Failed to update status");
        }
      })
      .catch((error) => {
        alert.current.showError(error.message);
      });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Student Attendance"}
        actionButton={true}
        label={"Generate Report"}
        onClick={() => {}}
      />
      <AlertBar ref={alert} />
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
              <>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleTakeAttendance(item.userId)}
                  sx={{ marginRight: "10px", width: "10px" }}
                >
                  ✔
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => handleTakeAttendanceAbs(item.userId)}
                >
                  X
                </Button>
              </>
            ),
          },
        ]}
        onRawClick={(item) => navigate(`details/${item?.userId}`)}
      />

      <ModalPage ref={modal} />
    </Box>
  );
}
