import { projects } from '../../data/projects.js';

export const ProjectService = {
  async fetchAll() {
    return projects;
  },
};
