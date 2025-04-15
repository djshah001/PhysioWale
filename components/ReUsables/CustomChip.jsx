import React from "react";
import { Chip } from "react-native-paper";
import colors from "../../constants/colors";
export function CustomChip({ spec, otherStyles, compact }) {
  return (
    <Chip
      className={`mr-2 mb-1 text-white-200 shadow-md shadow-accent rounded-full ${otherStyles}`}
      textStyle={{
        fontSize: compact ? 10 : 12,
        color: colors.white[300],
        fontWeight: "bold",
        marginHorizontal: compact ? 0 : 4,
        marginVertical: compact ? 1 : 2,
      }}
      style={{
        backgroundColor: colors.accent["DEFAULT"],
        paddingHorizontal: compact ? 1 : 2,
        paddingVertical: compact ? 2 : 4, // height: 24,
      }}
      elevated
      elevation={3}
      compact
    >
      {spec}
    </Chip>
  );
}
