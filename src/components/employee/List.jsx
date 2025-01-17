import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import axios from "axios";
import styled, { StyleSheetManager } from "styled-components";

// Styled components
const StyledContainer = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h3`
  text-align: center;
  font-size: 1.875rem;
  font-weight: bold;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  width: 250px;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
`;

const AddButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: #38b2ac;
  border-radius: 0.375rem;
  color: white;
  text-decoration: none;
`;

const shouldForwardProp = (prop) => {
  return prop !== "center"; // Filter out the 'center' prop
};

const customStyles = {
  headCells: {
    style: {
      fontSize: "1.125rem",
      fontWeight: "bold",
    },
  },
  cells: {
    style: {
      fontSize: "1rem",
    },
  },
};

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployee] = useState([]);

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const response = await axios.get(
        "https://ems-backend-self.vercel.app/api/employee/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        let sno = 1;
        const data = response.data.employees
          .filter((emp) => emp.department) // Exclude employees without a department
          .map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dept_name: emp.department.dept_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                className="rounded-full p-2"
                src={`https://ems-backend-self.vercel.app/${emp.userId.profileImage}`}
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                alt="Profile"
              />
            ),
            action: <EmployeeButtons _id={emp._id} />,
          }));
        setEmployees(data);
        setFilteredEmployee(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); // Run on component mount

  const handleFilter = (e) => {
    const records = employees.filter((emp) => {
      return emp.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredEmployee(records);
  };

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <StyledContainer>
        <Title center={true}>Manage Employees</Title>
        <div className="flex justify-between items-center mb-6">
          <SearchInput
            type="text"
            onChange={handleFilter}
            placeholder="Search By Employee Name"
          />
          <AddButton to="/admin-dashboard/add-employee">
            Add New Employee
          </AddButton>
        </div>
        <div>
          <DataTable
            columns={columns}
            data={filteredEmployee}
            customStyles={customStyles}
            pagination
          />
        </div>
      </StyledContainer>
    </StyleSheetManager>
  );
};

export default List;
