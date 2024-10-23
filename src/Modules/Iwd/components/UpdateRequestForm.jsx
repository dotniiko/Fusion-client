import React, { useState, useContext, useMemo } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Flex,
  Grid,
  Loader,
  Paper,
  Text,
  Textarea,
  Select,
  Center,
  CheckIcon,
  TextInput,
} from "@mantine/core";
import PropTypes from "prop-types";
import axios from "axios";
import { host } from "../../../routes/globalRoutes";
import { DesignationsContext } from "../helper/designationContext";
import classes from "../iwd.module.css";

function UpdateRequestForm({ selectedRequest, onBack }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const designations = useContext(DesignationsContext);

  const designationsList = useMemo(
    () =>
      designations.map(
        (designation) =>
          `${designation.designation.name}|${designation.username}`,
      ),
    [designations],
  );

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: selectedRequest.name,
      description: selectedRequest.description,
      area: selectedRequest.area,
      designation: null,
    },
    validate: {
      name: (value) => (value ? null : "Field is required"),
      description: (value) => (value ? null : "Field is required"),
      area: (value) => (value ? null : "Field is required"),
      designation: (value) => (value ? null : "Field is required"),
    },
  });

  const handleSubmitButtonClick = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    const token = localStorage.getItem("authToken");
    const data = form.getValues();
    data.id = selectedRequest.id;

    try {
      const response = await axios.put(
        // change the url to the correct one
        `${host}/iwdModuleV2/api/requests-view/${selectedRequest.id}/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      console.log(response);
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          onBack();
        }, 1000);
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    /* eslint-disable react/jsx-props-no-spreading */
    <Grid mt="xl">
      <div className="container">
        <form
          onSubmit={form.onSubmit((values) => {
            if (form.validate(values)) handleSubmitButtonClick();
            console.log(values);
          })}
        >
          <Paper
            radius="md"
            px="lg"
            pt="sm"
            pb="xl"
            style={{
              borderLeft: "0.6rem solid #15ABFF",
              width: "30vw",
              minHeight: "45vh",
              maxHeight: "70vh",
            }}
            withBorder
            maw="1240px"
            backgroundColor="white"
          >
            <Flex
              direction="column"
              gap="lg"
              style={{ textAlign: "left", width: "100%", fontFamily: "Arial" }}
            >
              <Flex direction="column">
                <Text size="22px" style={{ fontWeight: "bold" }}>
                  Update Request
                </Text>
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Name"
                  placeholder=""
                  classNames={classes}
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  required
                />
              </Flex>

              <Flex direction="column" gap="xs">
                <Textarea
                  placeholder="Description"
                  variant="filled"
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  style={{ width: "100%" }}
                  required
                  backgroundColor="#efefef"
                  cols={50}
                  rows={3}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Area"
                  placeholder="Area"
                  classNames={classes}
                  key={form.key("area")}
                  {...form.getInputProps("area")}
                  required
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <Select
                  mt="md"
                  comboboxProps={{ withinPortal: true }}
                  data={designationsList}
                  placeholder="Select designation"
                  label="Send To"
                  classNames={classes}
                  // purane me key: form.key("sendto")
                  key={form.key("designation")}
                  // purane me {...form.getInputProps("sendto")}
                  {...form.getInputProps("designation")}
                  required
                />
              </Flex>

              <Flex gap="xs">
                <Button
                  size="sm"
                  type="submit"
                  variant="filled"
                  color="black"
                  style={{
                    width: "100px",
                    backgroundColor: "#1E90FF",
                    color: isSuccess ? "black" : "white",
                    border: "none",
                    borderRadius: "20px",
                  }}
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <Center>
                      <Loader color="black" size="xs" />
                    </Center>
                  ) : isSuccess ? (
                    <Center>
                      <CheckIcon size="16px" color="black" />
                    </Center>
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="filled"
                  color="#1E90FF"
                  onClick={onBack}
                  disabled={isLoading || isSuccess}
                  style={{
                    border: "none",
                    borderRadius: "20px",
                  }}
                >
                  Back
                </Button>
              </Flex>
            </Flex>
          </Paper>
        </form>
      </div>
    </Grid>
    /* eslint-enable react/jsx-props-no-spreading */
  );
}

UpdateRequestForm.propTypes = {
  selectedRequest: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    area: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default UpdateRequestForm;
