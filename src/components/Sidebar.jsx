import React from "react";
import {
  FaHome,
  FaComments,
  FaFileMedical,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaTooth
} from "react-icons/fa";


const Sidebar = ({
  activeTab,
  setActiveTab,
  role = "Patient",
  navigate
}) => {


  const patientMenu = [
    {
      name: "overview",
      label: "Overview",
      icon: <FaHome />
    },
    {
      name: "messages",
      label: "Messages",
      icon: <FaComments />
    },
    {
      name: "report",
      label: "Reports",
      icon: <FaFileMedical />
    }
  ];


  const dentistMenu = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: <FaHome />
    },
    {
      name: "patients",
      label: "Patients",
      icon: <FaUser />
    },
    {
      name: "appointments",
      label: "Appointments",
      icon: <FaCalendarAlt />
    },
    {
      name: "dentalChart",
      label: "Dental Chart",
      icon: <FaTooth />
    },
    {
      name: "reports",
      label: "Reports",
      icon: <FaFileMedical />
    },
    {
      name: "chats",
      label: "Messages",
      icon: <FaComments />
    }
  ];


  const menu =
    role === "Dentist"
      ? dentistMenu
      : patientMenu;



  return (

    <aside className="
      w-64 
      min-h-screen
      bg-gradient-to-b 
      from-teal-700 
      to-cyan-700
      text-white
      p-5
      flex
      flex-col
    ">


      {/* LOGO */}

      <div className="flex items-center gap-2 mb-8">

        <FaTooth className="text-3xl"/>

        <h1 className="text-xl font-bold">
          Dental Club
        </h1>

      </div>



      {/* MENU */}

      <nav className="flex-1 space-y-2">


        {menu.map((item)=>(

          <button
            key={item.name}
            onClick={() =>
              setActiveTab(item.name)
            }
            className={`
              flex
              items-center
              gap-3
              w-full
              p-3
              rounded-lg
              transition

              ${
                activeTab === item.name
                ?
                "bg-white/25"
                :
                "hover:bg-white/10"
              }

            `}
          >

            {item.icon}

            <span>
              {item.label}
            </span>


          </button>


        ))}


      </nav>




      {/* LOGOUT */}

      <button

        onClick={() => navigate("/")}

        className="
          flex
          items-center
          gap-3
          bg-red-500
          hover:bg-red-600
          p-3
          rounded-lg
        "

      >

        <FaSignOutAlt/>

        Logout


      </button>



    </aside>

  );
};


export default Sidebar;