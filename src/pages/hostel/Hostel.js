import { Box, Button } from "@mui/material";
import HeaderDisplay from "../../components/HeaderDisplay";
import AlertBar from "../../components/AlertBar";
import Table from "../../components/Tables";
import { capitalize } from "../../helpers";
import { useRef, useState } from "react";
import ModalPage from "../../components/ModalPage";
import TextInputField from "../../components/TextInputField";
import { BASE_URL } from "../../constants";
import Form from "../../components/Form";
import { reportErrors } from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import SelectInputField from "../../components/SelectInputField";
import Confirmation from "../../components/Confirmation";

export function HostelModal(props) {
  const alert = useRef();
  const form = useRef();

  const nameInput = useRef();

  const capacityInput = useRef();
  const descriptionInput = useRef();
  const categoryInput = useRef();

  const [name, setName] = useState(props?.data?.name || undefined);
  const [canSubmit, setCanSubmit] = useState(true);
  const [capacity, setCapacity] = useState(props?.data?.capacity || "");
  const [description, setDescription] = useState(
    props?.data?.description || ""
  );
  const [category, setCategory] = useState(props?.data?.category || "");

  const ModalForm = () => {
    const capacityNumber = parseInt(capacity);
    if (isNaN(capacityNumber)) {
      alert.current.showError("Capacity must be a valid number.");
      return;
    }
    let data = {
      name,
      capacity: capacityNumber,
      description,
      category,
    };
    if (form.current.validate()) {
      setCanSubmit(false);
      if (props.data?.feeId) {
        window.axios
          .put(`${BASE_URL}api/hostel/${props.data?.hostedId}`, data)
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
          .post(`${BASE_URL}api/hostel`, data)
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
          label={"Hostel Name"}
          required={true}
          value={name}
          onChange={(value) => setName(value)}
        />
        <TextInputField
          ref={capacityInput}
          label={"Hostel Capacity"}
          required={true}
          value={capacity}
          onChange={(value) => setCapacity(value)}
        />
        <TextInputField
          ref={descriptionInput}
          label={"Hostel Description"}
          required={true}
          value={description}
          onChange={(value) => setDescription(value)}
        />
        <SelectInputField
          ref={categoryInput}
          label={"Hostel Category"}
          required={true}
          options={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Both", value: "Both" },
          ]}
          onChange={(value) => setCategory(value)}
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

export function Hostel(props) {
  const alert = useRef();
  const modal = useRef();
  const [params, setParams] = useState({
    name: undefined,
    capacity: undefined,
    level: undefined,
    location: undefined,
    copies: undefined,
    refresh: true,
  });

  const handleDelete = (id) => {
    setParams({ ...params, deleteId: id });
    modal.current.show(
      "Confirm Delete",
      <Confirmation
        message="Are you sure you want to delete this hostel"
        handleOk={() => deleteHostel(id)}
        handleClose={() => modal.current.hide()}
      />,
      "30%"
    );
  };

  const deleteHostel = (id) => {
    window.axios
      .delete(`${BASE_URL}api/hostel/${id}`)
      .then((response) => {
        if (response.ok) {
          alert.current.showSuccess("Hostel deleted successfully");
          props.refresh();
        } else {
          throw new Error("Failed to delete hostel");
        }
      })
      .catch((error) => {
        alert.current.showError(error.message);
      });
  };

  const HostelModals = (data = {}) => {
    let component = <HostelModal modal={modal} refresh={refresh} data={data} />;
    modal.current.show("Hostel Dominitories", component, "50%");
  };
  const refresh = () => {
    setParams({ ...params, refresh: !params.refresh });
  };

  return (
    <Box>
      <HeaderDisplay
        title={"Hostel Domitories"}
        actionButton={true}
        label={"Add Hostel"}
        onClick={() => HostelModals()}
      />
      <AlertBar ref={alert} />
      <Table
        title={""}
        url={"api/hostel"}
        params={params}
        columns={[
          {
            id: "name",
            label: "Hostel Name",
            customRender: true,
            valueGetter: (item) => capitalize(item?.name),
          },
          {
            id: "capacity",
            label: "Hostel Capacity",
            customRender: true,
            valueGetter: (item) => item?.capacity,
          },
          {
            id: "category",
            label: "Hostel Category",
            customRender: true,
            valueGetter: (item) => item?.category,
          },
          {
            id: "description",
            label: "Hostel Description",
            customRender: true,
            valueGetter: (item) => item?.description,
          },
          {
            id: "action",
            label: "Action",
            disabled: true,
            customRender: true,
            valueGetter: (item) => (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => HostelModals(item)}
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        onRawClick={() => {}}
      />
      <ModalPage ref={modal} />
    </Box>
  );
}
