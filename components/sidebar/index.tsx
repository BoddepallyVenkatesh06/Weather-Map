"use client";
import { motion } from "framer-motion";
import { appRoutes } from "./Links";
import { NavLink } from "./nav.links";

const Sidebar = () => {
  return (
    <motion.aside className="bg-secondary text-white sticky left-0 top-0 lg:px-2">
      <NavLink linkArray={appRoutes} />
    </motion.aside>
  );
};

export default Sidebar;
