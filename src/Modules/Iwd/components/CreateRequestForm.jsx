import React, { useState, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
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
import { useForm } from "@mantine/form";
import PropTypes from "prop-types";
import axios from "axios";
import classes from "../iwd.module.css";
import { host } from "../../../routes/globalRoutes";
import { DesignationsContext } from "../helper/designationContext";

function CreateRequest({ setActiveTab }) {
  const role = useSelector((state) => state.user.role);

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
  // console.log(designationsList);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: null,
      description: null,
      area: null,
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
    data.role = role;
    console.log(data);
    try {
      const response = await axios.post(
        `${host}/iwdModuleV2/api/requests-view/`,
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
          setActiveTab("0");
        }, 500);
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
                  New Request
                </Text>
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Name"
                  required
                  placeholder=""
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  classNames={classes}
                />
              </Flex>

              <Flex direction="column" gap="xs">
                <Textarea
                  placeholder="Description"
                  required
                  variant="filled"
                  style={{ width: "100%" }}
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  backgroundColor="#efefef"
                  cols={50}
                  rows={3}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <TextInput
                  label="Area"
                  required
                  placeholder=""
                  key={form.key("area")}
                  {...form.getInputProps("area")}
                  classNames={classes}
                />
              </Flex>

              <Flex direction="column" gap="xs" justify="flex-start">
                <Select
                  mt="md"
                  comboboxProps={{ withinPortal: true }}
                  data={designationsList}
                  placeholder="Director(Dir)"
                  label="designation"
                  classNames={classes}
                  key={form.key("designation")}
                  {...form.getInputProps("designation")}
                  required
                />
              </Flex>

              <Flex gap="xs">
                <Button
                  size="sm"
                  variant="filled"
                  color="black"
                  type="submit"
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
              </Flex>
            </Flex>
          </Paper>
        </form>
      </div>
    </Grid>
    /* eslint-enable react/jsx-props-no-spreading */
  );
}
CreateRequest.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};
export default CreateRequest;
