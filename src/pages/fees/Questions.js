import {Box, IconButton, Stack} from "@mui/material";
import Table from "../../components/Tables";
import AlertBar from "../../components/AlertBar";
import {useRef, useState} from "react";
import ModalPage from "../../components/ModalPage";
import {reportErrors} from "../../helpers";
import ActionButtonField from "../../components/ActionButtonField";
import {Delete, Edit, ListAltOutlined} from "@mui/icons-material";
import Form from "../../components/Form";
import TextInputField from "../../components/TextInputField";
import {BASE_URL} from "../../constants";
import useFetch from "../../hooks/useFetch";
import SelectInputField from "../../components/SelectInputField";
import HeaderDisplay from "../../components/HeaderDisplay";
import {useParams} from "react-router-dom";
import Description from "../../components/Description";

const question_types = [
    {label: "MultipleChoice", value: "Choice"},
    {label: "Text", value: "Text"},
    {label: "Both", value: "Both"},
];

const statuses = [
    {label: "Active", value: "Active"},
    {label: "InActive", value: "InActive"}
]

export function QuestionAnswerModal(props) {
    const alert = useRef();
    const form = useRef();

    const nameInput = useRef();

    const [name, setName] = useState();
    const [canSubmit, setCanSubmit] = useState(true);

    const [params, setParams] = useState({
        refresh: true,
        questionId: props.data?.questionId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const submit = (remove = false) => {
        let data = {
            name,
            status: "Active",
            questionId: props.data?.questionId && parseInt(props.data?.questionId),
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (remove) {
                window.axios
                    .delete(`${BASE_URL}api/setup/answer/${props.data?.questionId}`, data)
                    .then(response => {
                        alert.current.showSuccess("Removed Successfully.");
                        setCanSubmit(true);
                        setTimeout(() => {
                            refresh();
                        }, 1000)
                    })
                    .catch(error => {
                        setCanSubmit(true);
                        reportErrors(alert.current, error);
                    });
            } else {
                window.axios
                    .post(`${BASE_URL}api/setup/answer`, data)
                    .then(response => {
                        alert.current.showSuccess("Create Successfully.");
                        setCanSubmit(true);
                        setTimeout(() => {
                            refresh();
                        }, 1000)
                    })
                    .catch(error => {
                        setCanSubmit(true);
                        reportErrors(alert.current, error);
                    });
            }
        }
    }

    return (
        <Box>
            <Form ref={form}>
                <Stack direction={"row"}>
                    <Box sx={{flexGrow: 1}}>
                        <TextInputField
                            ref={nameInput}
                            placeholder={"Answer"}
                            required={true}
                            value={name}
                            multiline={true}
                            onChange={(value) => setName(value)}
                        />
                    </Box>
                    <ActionButtonField
                        disabled={!canSubmit}
                        color={"secondary"}
                        label={"Save"}
                        onClick={() => submit()}/>
                </Stack>
            </Form>
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/answer"}
                params={params}
                columns={[
                    {
                        id: 'description',
                        label: 'Answer',
                        customRender: true,
                        valueGetter: (item) => (item?.name),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => submit(true)}><Delete/></IconButton>),
                    },
                ]}
            />
        </Box>
    );
}

export function TopicNotesModalPage(props) {
    const alert = useRef();
    const form = useRef();

    const nameInput = useRef();
    const optionLabelInput = useRef();
    const questionTypeInput = useRef();
    const statusInput = useRef();

    const [name, setName] = useState(props?.data?.name || undefined);
    const [optionLabel, setOptionLabel] = useState(props?.data?.label || undefined);
    const [questionType, setQuestionType] = useState(props.data?.nature || undefined);
    const [status, setStatus] = useState(props.data?.status || "Active");
    const [canSubmit, setCanSubmit] = useState(true);

    const ModalForm = () => {
        let data = {
            name,
            label: optionLabel,
            nature: questionType,
            quizId: props.quizId && parseInt(props.quizId),
            status: status,
        };
        if (form.current.validate()) {
            setCanSubmit(false);
            if (props.data?.questionId) {
                window.axios
                    .put(`${BASE_URL}api/setup/question/${props.data?.questionId}`, data)
                    .then(response => {
                        alert.current.showSuccess("Update Successfully.");
                        setCanSubmit(true);
                        setTimeout(() => {
                            props.modal.current.hide();
                            props.refresh();
                        }, 1000)
                    })
                    .catch(error => {
                        setCanSubmit(true);
                        reportErrors(alert.current, error);
                    });
            } else {
                window.axios
                    .post(`${BASE_URL}api/setup/question`, data)
                    .then(response => {
                        alert.current.showSuccess("Create Successfully.");
                        setCanSubmit(true);
                        setTimeout(() => {
                            props.modal.current.hide();
                            props.refresh();
                        }, 1000)
                    })
                    .catch(error => {
                        setCanSubmit(true);
                        reportErrors(alert.current, error);
                    });
            }
        }
    }

    return (
        <Box>
            <AlertBar ref={alert}/>
            <Form ref={form}>
                <TextInputField
                    ref={nameInput}
                    label={"Question"}
                    required={true}
                    value={name}
                    multiline={true}
                    onChange={(value) => setName(value)}
                />
                <SelectInputField
                    ref={questionTypeInput}
                    required={true}
                    label={"Nature"}
                    options={question_types}
                    value={questionType}
                    onChange={(value) => setQuestionType(value)}
                />
                {questionType === "Both" && <TextInputField
                    ref={optionLabelInput}
                    label={"Option Label"}
                    value={optionLabel}
                    onChange={(value) => setOptionLabel(value)}
                />}
                <SelectInputField
                    ref={statusInput}
                    required={true}
                    label={"Status"}
                    options={statuses}
                    value={status}
                    onChange={(value) => setStatus(value)}
                />
                <ActionButtonField
                    disabled={!canSubmit}
                    color={"secondary"}
                    label={props?.data?.questionId ? "Update" : "Save"}
                    onClick={() => ModalForm()}/>
            </Form>
        </Box>
    );
}

export default function Questions(props) {
    const {quizId} = useParams();
    const alert = useRef();
    const modal = useRef();

    const [params, setParams] = useState({
        refresh: true,
        quizId: quizId
    });

    const refresh = () => {
        setParams({...params, refresh: !params.refresh});
    }

    const {data: quiz} = useFetch(`api/setup/quiz/${quizId}`, {}, true, {}, (response) => response.data);

    const TopicModal = (data = {}) => {
        let component = (
            <TopicNotesModalPage
                modal={modal}
                refresh={refresh}
                quizId={quizId}
                data={data}
            />);
        modal.current.show("Question", component, "60%")
    }

    const QuestionAnswerChoiceModal = (data = {}) => {
        let component = (
            <QuestionAnswerModal
                modal={modal}
                refresh={refresh}
                quizId={quizId}
                data={data}
            />);
        modal.current.show("Answers", component, "60%")
    }

    return (
        <Box>
            <Description label={"Quiz Description"} value={quiz?.name}/>
            <HeaderDisplay
                title={"Questions"}
                actionButton={true}
                label={"Question"}
                onClick={() => TopicModal()}
            />
            <AlertBar ref={alert}/>
            <Table
                title={""}
                url={"api/setup/question"}
                params={params}
                columns={[
                    {
                        id: 'description',
                        label: 'Question',
                        customRender: true,
                        valueGetter: (item) => (item?.name),
                    },
                    {
                        id: 'nature',
                        label: 'Nature',
                        customRender: true,
                        valueGetter: (item) => (item?.nature),
                    },
                    {
                        id: 'label',
                        label: 'Option Label',
                        customRender: true,
                        valueGetter: (item) => (item?.label),
                    },
                    {
                        id: 'choices',
                        label: 'Choices',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton
                                onClick={() => QuestionAnswerChoiceModal(item)}><ListAltOutlined/></IconButton>),
                    },
                    {
                        id: 'action',
                        label: 'Action',
                        minWidth: 10,
                        disabled: true,
                        customRender: true,
                        valueGetter: (item) => (
                            <IconButton onClick={() => TopicModal(item)}><Edit/></IconButton>),
                    },
                ]}
            />
            <ModalPage ref={modal}/>
        </Box>
    )
        ;
}