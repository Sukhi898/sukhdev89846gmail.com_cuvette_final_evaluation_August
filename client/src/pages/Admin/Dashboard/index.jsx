import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../store/authContext";
import StatsCard from "../StatsCard";
import Trendings from "./Trendings";
import styles from "./styles/index.module.css";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const { user } = useContext(AuthContext);

  const fetchStats = useCallback(async () => {
    try {
      if (!user) {
        throw new Error("User not found");
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/stats`,
        {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Couldn't fetch data");
      }

      const resObj = await res.json();
      return resObj;
    } catch (error) {
      console.error("Error fetching stats:", error.message);
      return { data: { stats: {} } };
    }
  }, [user]);

  useEffect(() => {
    fetchStats().then((data) => {
      if (data && data.data && data.data.stats) {
        setStats(data.data.stats);
      } else {
        console.error("Unexpected response structure:", data);
      }
    });
  }, [fetchStats]);

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <StatsCard
          color={"#FF5D01"}
          number={stats.totalQuizzesAndPolls || 0}
          text="Quizzes and Polls Created"
        />
        <StatsCard
          color={"#60B84B"}
          number={stats.totalQuestions || 0}
          text="Questions Created"
        />
        <StatsCard
          color={"#5076FF"}
          number={stats.totalImpressions || 0}
          text="Total Impressions"
        />
      </div>
      <Trendings />
    </div>
  );
}
