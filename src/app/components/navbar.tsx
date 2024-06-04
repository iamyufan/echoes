"use client";

import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

import Link from "next/link";
import styles from "./navbar.module.css";

const Navbar = () => {
  const { user, setUser } = useAuthContext() as {
    user: any;
    setUser: Function;
  };
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility

  const logout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      setUser(null);
      router.push("/signin");
    } catch (error) {
      console.error("Logout Error:", error);
    }

    router.push("/");
  };

  const directToMe = () => {
    router.push("/profile");
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.links}>
          <p className={styles.logo}>
            <Link href="/">Echoes.</Link>
          </p>
          <Link href="/chamber">chamber</Link>
          <Link href="/new">echo</Link>
        </div>
        <div className={styles.navbarRight}>
          <div className={styles.auth}>
            {user ? (
              <div className={styles.auth}>
                <span
                  className={styles.emailLink}
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  {user.email}
                  {showDropdown && (
                    <div className={styles.dropdownMenu}>
                      <button
                        onClick={directToMe}
                        className={styles.dropdownItem}
                      >
                        Profile
                      </button>
                      <button onClick={logout} className={styles.dropdownItem}>
                        Log Out
                      </button>
                    </div>
                  )}
                </span>
              </div>
            ) : (
              <Link href="/signin">
                <span className={styles.link}>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
