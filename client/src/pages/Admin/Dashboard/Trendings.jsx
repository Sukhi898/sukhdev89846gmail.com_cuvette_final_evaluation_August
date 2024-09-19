 import { useCallback, useContext, useEffect, useState } from "react";
 import { Icon } from "@iconify/react";
import { AuthContext } from "../../../store/authContext";
import copyLink from "../../../utils/copyLink";
import formatDate from "../../../utils/formatDate";
import styles from "./styles/Trendings.module.css";

export default function Trendings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchList = useCallback(async () => {
    console.log("Fetching trendings");
    try {
      if (!user) {
        throw new Error("User not found");
      }

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/users/trendings`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + user,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Couldn't fetch list");
      }

      const resJson = await res.json();
      return resJson;
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const data = await fetchList();
      if (isMounted && data) {
        const filteredData = data.data.docs.filter((el) => el.impressions > 10);
        setList(filteredData);
      }
      setLoading(false);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchList]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h2>Trending Quizzes</h2>
      {list.length > 0 ? (
        <div className={styles.quizCards}>
          {list.map((el) => (
            <div
              type="button"
              onClick={() => copyLink(el._id, el.category)}
              key={el._id}
              className={styles.card}
            >
              <div>
                <p className={styles.name}>{el.name}</p>
                <div className={styles.impressions}>
                  <p>{el.impressions}</p>
                  <Icon style={{ fontSize: "1.5rem" }} icon="iconoir:eye" />
                </div>
              </div>
              <p className={styles.date}>
                Created on: {formatDate(el.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No trending quizzes or polls found.</p>
      )}
    </div>
  );
}
