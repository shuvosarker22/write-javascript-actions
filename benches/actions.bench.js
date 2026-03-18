import { bench, describe } from "vitest";

/**
 * Simulates parsing action metadata from a YAML-like structure.
 */
function parseActionInputs(metadata) {
  const inputs = {};
  for (const [key, value] of Object.entries(metadata)) {
    inputs[key] = {
      description: value.description || "",
      required: value.required || false,
      default: value.default || undefined,
    };
  }
  return inputs;
}

/**
 * Simulates building a command string from action inputs.
 */
function buildCommand(inputs) {
  const parts = [];
  for (const [key, value] of Object.entries(inputs)) {
    if (value !== undefined && value !== "") {
      parts.push(`--${key}=${value}`);
    }
  }
  return parts.join(" ");
}

/**
 * Simulates validating required inputs for an action.
 */
function validateRequiredInputs(metadata, provided) {
  const errors = [];
  for (const [key, config] of Object.entries(metadata)) {
    if (config.required && !(key in provided)) {
      errors.push(`Missing required input: ${key}`);
    }
  }
  return errors;
}

const sampleMetadata = {
  name: { description: "The name of the person to greet", required: true },
  greeting: {
    description: "The greeting to use",
    required: false,
    default: "Hello",
  },
  uppercase: {
    description: "Whether to uppercase the greeting",
    required: false,
    default: "false",
  },
};

describe("Action Input Parsing", () => {
  bench("parse action inputs", () => {
    parseActionInputs(sampleMetadata);
  });

  bench("parse large action inputs", () => {
    const largeMetadata = {};
    for (let i = 0; i < 50; i++) {
      largeMetadata[`input_${i}`] = {
        description: `Input number ${i}`,
        required: i % 3 === 0,
        default: i % 2 === 0 ? `default_${i}` : undefined,
      };
    }
    parseActionInputs(largeMetadata);
  });
});

describe("Command Building", () => {
  bench("build command from inputs", () => {
    buildCommand({
      name: "World",
      greeting: "Hello",
      uppercase: "false",
    });
  });

  bench("build command with many inputs", () => {
    const inputs = {};
    for (let i = 0; i < 30; i++) {
      inputs[`param_${i}`] = `value_${i}`;
    }
    buildCommand(inputs);
  });
});

describe("Input Validation", () => {
  bench("validate required inputs - all provided", () => {
    validateRequiredInputs(sampleMetadata, {
      name: "World",
      greeting: "Hello",
    });
  });

  bench("validate required inputs - missing inputs", () => {
    validateRequiredInputs(sampleMetadata, { greeting: "Hello" });
  });
});
