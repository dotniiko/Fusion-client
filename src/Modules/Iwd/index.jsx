import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { Tabs, Button, Flex, Text, Breadcrumbs } from "@mantine/core";
import classes from "../Dashboard/Dashboard.module.css";
import ModuleNotifications from "./components/ModuleNotifications";
import CreateRequest from "./components/CreateRequestForm";
import IssueWorkOrder from "./components/IssueWorkOrder";
import RejectedRequests from "./components/RejectedRequest";
import RequestsInProgress from "./components/RequestsInProgress";
import FinalBillRequest from "./components/FinalBillRequest";
import ManageBudget from "./components/ManageBudget";
import CreatedRequests from "./components/CreatedRequests";
import ViewBudget from "./components/ViewBudget";
import ProcessedBills from "./components/ProcessedBills";

import ApproveRejectRequest from "./components/ApproveRejectRequest";

// import ViewRequestFile from "./components/ViewRequestFile";
// import { DesignationsContext } from "./helper/designationContext";

function IwdPage() {
  const role = useSelector((state) => state.user.role);
  const [activeTab, setActiveTab] = useState("0");
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const tabsListRef = useRef(null);

  const tabItems = [
    { title: "Notifications", component: <ModuleNotifications /> },
    {
      title: "Create Request",
      component: <CreateRequest setActiveTab={setActiveTab} />,
    },
    { title: "Requests in Progress", component: <RequestsInProgress /> },
    { title: "Issue Work Order", component: <IssueWorkOrder /> },
    { title: "Generate Final Bill", component: <FinalBillRequest /> },
    { title: "Rejected Requests", component: <RejectedRequests /> },
    { title: "Manage Budget", component: <ManageBudget /> },
    {
      title: "Created Requests",
      component: <CreatedRequests setActiveTab={setActiveTab} />,
    },
    { title: "View Budget", component: <ViewBudget /> },
    { title: "Processed Bills", component: <ProcessedBills /> },
    {
      title: "Approve/Reject Requests",
      component: <ApproveRejectRequest setActiveTab={setActiveTab} />,
    },
  ];

  const roleBasedTabs = {
    Professor: tabItems.filter((tab) =>
      ["Notifications", "Create Request", "Requests in Progress"].includes(
        tab.title,
      ),
    ),
    SectionHead_IWD: tabItems.filter((tab) =>
      [
        "Notifications",
        "Create Request",
        "Issue Work Order",
        "Manage Budget",
      ].includes(tab.title),
    ),
    "Accounts Admin": tabItems.filter((tab) =>
      [
        "Notifications",
        "Create Request",
        "Processed Bills",
        "Manage Budget",
      ].includes(tab.title),
    ),
  };

  const filteredTabs = useMemo(() => {
    return roleBasedTabs[role] || tabItems;
  }, [role]);

  const handleTabChange = (direction) => {
    const newIndex =
      direction === "next"
        ? Math.min(+activeTab + 1, filteredTabs.length - 1)
        : Math.max(+activeTab - 1, 0);
    setActiveTab(String(newIndex));
    tabsListRef.current.scrollBy({
      left: direction === "next" ? 50 : -50,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const currentTab = filteredTabs[parseInt(activeTab, 10)];

    const breadcrumbs = [
      { title: "Home", href: "/dashboard" },
      { title: "IWD", href: "/iwd" },
      { title: currentTab.title, href: "#" },
    ].map((item, index) => (
      <Text key={index} component="a" href={item.href} size="sm">
        {item.title}
      </Text>
    ));

    setBreadcrumbItems(breadcrumbs);
  }, [activeTab, filteredTabs]);

  return (
    <>
      <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
      {/* <CustomBreadcrumbs /> */}
      <Flex
        justify="flex-start"
        align="center"
        gap={{ base: "0.5rem", md: "1rem" }}
        mt={{ base: "1rem", md: "1.5rem" }}
        ml={{ md: "lg" }}
      >
        <Button
          onClick={() => handleTabChange("prev")}
          variant="default"
          p={0}
          style={{ border: "none" }}
        >
          <CaretCircleLeft
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>

        <div className={classes.fusionTabsContainer} ref={tabsListRef}>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List style={{ display: "flex", flexWrap: "nowrap" }}>
              {filteredTabs.map((item, index) => (
                <Tabs.Tab
                  value={`${index}`}
                  key={index}
                  className={
                    activeTab === `${index}`
                      ? classes.fusionActiveRecentTab
                      : ""
                  }
                >
                  <Text>{item.title}</Text>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </div>

        <Button
          onClick={() => handleTabChange("next")}
          variant="default"
          p={0}
          style={{ border: "none" }}
        >
          <CaretCircleRight
            className={classes.fusionCaretCircleIcon}
            weight="light"
          />
        </Button>
      </Flex>
      {filteredTabs[parseInt(activeTab, 10)].component}
    </>
  );
}

export default IwdPage;
