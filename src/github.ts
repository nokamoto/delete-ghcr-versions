import * as github from "@actions/github";

type accountType = "user" | "org";

interface packageType {
  token: string;
  owner: string;
  name: string;
}

interface version {
  name: string;
  id: number;
  created_at: string;
  deleted_at?: string;
  updated_at?: string;
}

export function pretty(res: { status: number; url: string }): string {
  try {
    return JSON.stringify({ status: res.status, url: res.url });
  } catch (e) {
    return "";
  }
}

export async function getAccountType({
  token,
  owner,
}: Omit<packageType, "name">): Promise<accountType> {
  const octokit = github.getOctokit(token);

  return octokit.rest.users
    .getByUsername({ username: owner })
    .then((response) => {
      console.log(pretty(response));
      if (response.data.type === "User") {
        return "user";
      } else if (response.data.type === "Organization") {
        return "org";
      } else {
        throw new Error(`Unrecognized account type: ${response.data.type}`);
      }
    });
}

export async function getAllPackageVersionsForUser({
  token,
  owner,
  name,
}: packageType): Promise<version[]> {
  const octokit = github.getOctokit(token);

  return octokit.rest.packages
    .getAllPackageVersionsForPackageOwnedByUser({
      package_type: "container",
      username: owner,
      package_name: name,
    })
    .then((res) => {
      console.log(pretty(res));
      return res.data.map((v) => {
        return {
          name: v.name,
          id: v.id,
          created_at: v.created_at,
          deleted_at: v.deleted_at,
          updated_at: v.updated_at,
        };
      });
    });
}

export async function getAllPackageVersionsForOrg({
  token,
  owner,
  name,
}: packageType): Promise<version[]> {
  const octokit = github.getOctokit(token);

  return octokit.rest.packages
    .getAllPackageVersionsForPackageOwnedByOrg({
      package_type: "container",
      org: owner,
      package_name: name,
    })
    .then((res) => {
      console.log(pretty(res));
      return res.data.map((v) => {
        return {
          name: v.name,
          id: v.id,
          created_at: v.created_at,
          deleted_at: v.deleted_at,
          updated_at: v.updated_at,
        };
      });
    });
}
