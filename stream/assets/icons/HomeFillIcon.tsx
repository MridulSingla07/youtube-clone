import React from "react";
import Svg, { Path, Stop, Defs, LinearGradient } from "react-native-svg";
import { COLORS_THEME_1 } from "../../constants/colors";

const HomeFillIcon = () => {
  return (
    <Svg width="23" height="22" viewBox="0 0 23 22" fill="none">
      <Path
        d="M12.4004 2.53367C12.0784 2.28318 11.9174 2.15794 11.7396 2.1098C11.5827 2.06732 11.4173 2.06732 11.2604 2.1098C11.0826 2.15794 10.9216 2.28318 10.5996 2.53367L4.38244 7.3692C3.96685 7.69243 3.75906 7.85405 3.60936 8.05645C3.47675 8.23574 3.37797 8.43772 3.31786 8.65246C3.25 8.89489 3.25 9.15814 3.25 9.68463V16.3167C3.25 17.3434 3.25 17.8568 3.44982 18.249C3.62559 18.5939 3.90605 18.8744 4.25102 19.0502C4.64319 19.25 5.15657 19.25 6.18333 19.25H8.01667C8.27336 19.25 8.4017 19.25 8.49975 19.2C8.58599 19.1561 8.6561 19.086 8.70004 18.9997C8.75 18.9017 8.75 18.7733 8.75 18.5167V12.4667C8.75 11.9533 8.75 11.6966 8.84991 11.5005C8.93779 11.328 9.07803 11.1878 9.25051 11.0999C9.44659 11 9.70329 11 10.2167 11H12.7833C13.2967 11 13.5534 11 13.7495 11.0999C13.922 11.1878 14.0622 11.328 14.1501 11.5005C14.25 11.6966 14.25 11.9533 14.25 12.4667V18.5167C14.25 18.7733 14.25 18.9017 14.3 18.9997C14.3439 19.086 14.414 19.1561 14.5003 19.2C14.5983 19.25 14.7266 19.25 14.9833 19.25H16.8167C17.8434 19.25 18.3568 19.25 18.749 19.0502C19.0939 18.8744 19.3744 18.5939 19.5502 18.249C19.75 17.8568 19.75 17.3434 19.75 16.3167V9.68463C19.75 9.15814 19.75 8.89489 19.6821 8.65246C19.622 8.43772 19.5232 8.23574 19.3906 8.05645C19.2409 7.85405 19.0331 7.69243 18.6176 7.3692L12.4004 2.53367Z"
        fill="url(#paint0_linear_129_11357)"
        stroke="url(#paint1_linear_129_11357)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_129_11357"
          x1="6.45149"
          y1="2.07794"
          x2="18.1524"
          y2="18.8175"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={COLORS_THEME_1.tabIconsFill} />
          <Stop offset="1" stopColor={COLORS_THEME_1.tabIconsFill} />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_129_11357"
          x1="6.45149"
          y1="2.07794"
          x2="18.1524"
          y2="18.8175"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={COLORS_THEME_1.tabIconsFill} />
          <Stop offset="1" stopColor={COLORS_THEME_1.tabIconsFill} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default HomeFillIcon;
