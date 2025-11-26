import projects from '../../data/projects.json';

export const ProjectService = {
  async fetchAll() {
    return projects;
  },
};
