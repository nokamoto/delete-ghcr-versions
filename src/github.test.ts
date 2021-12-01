import * as github from "@actions/github";
import { getAccountType } from "./github";

describe("getAccountType", () => {
  const setup = (getByUsername: jest.Mock) => {
    const getOctokit = jest.fn().mockImplementation(() => {
      const { GitHub } = jest.requireActual("@actions/github/lib/utils");
      return {
        ...GitHub,
        rest: {
          users: {
            getByUsername: getByUsername,
          },
        },
      };
    });

    const log = jest.fn();

    jest.spyOn(github, "getOctokit").mockImplementation(getOctokit);

    jest.spyOn(console, "log").mockImplementation(log);

    return [getOctokit, log];
  };

  it("should return 'user'", async () => {
    const getByUsername = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        data: {
          type: "User",
        },
      });
    });

    const [getOctokit] = setup(getByUsername);

    const result = await getAccountType({ token: "token", owner: "owner" });
    expect(result).toBe("user");

    expect(getOctokit).toHaveBeenCalledTimes(1);
    expect(getOctokit).toHaveBeenCalledWith("token");

    expect(getByUsername).toHaveBeenCalledTimes(1);
    expect(getByUsername).toHaveBeenCalledWith({ username: "owner" });
  });

  it("should retrun 'org", async () => {
    const getByUsername = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        data: {
          type: "Organization",
        },
      });
    });

    const [getOctokit] = setup(getByUsername);

    const result = await getAccountType({ token: "token", owner: "owner" });
    expect(result).toBe("org");

    expect(getOctokit).toHaveBeenCalledTimes(1);
    expect(getOctokit).toHaveBeenCalledWith("token");

    expect(getByUsername).toHaveBeenCalledTimes(1);
    expect(getByUsername).toHaveBeenCalledWith({ username: "owner" });
  });
});
