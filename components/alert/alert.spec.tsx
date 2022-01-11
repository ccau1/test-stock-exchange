import React from "react";
import { render } from "@testing-library/react";
import { Alert } from "./alert";

it("should render with the correct text", () => {
  const { getByText } = render(<Alert>testing 123</Alert>);
  const rendered = getByText("testing 123");
  expect(rendered).toBeTruthy();
});

it("should render correct color (default)", () => {
  const { container } = render(<Alert>testing 123</Alert>);
  expect(container).toHaveStyle(`color: "#004085"`);
});

it("should render correct color (defined color props)", () => {
  const { container } = render(<Alert color="danger">testing 123</Alert>);
  expect(container).toHaveStyle(`color: "#721c24"`);
});
