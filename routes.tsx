import { Dashboard } from "./components/Dashboard";
import { Expenses } from "./components/Expenses";
import { Analytics } from "./components/Analytics";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { Camera } from "./components/Camera";

export const routes = [
  { path: "/", component: Dashboard },
  { path: "/expenses", component: Expenses },
  { path: "/camera", component: Camera },
  { path: "/analytics", component: Analytics },
  { path: "/reports", component: Reports },
  { path: "/settings", component: Settings },
];