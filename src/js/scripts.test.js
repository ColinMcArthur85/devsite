import { jest } from '@jest/globals';

// Mock the imported modules
jest.mock("./modules/dot-magnet.js", () => ({
  initHeroDots: jest.fn(),
}));
jest.mock("./modules/avatar-tilt.js", () => ({
  initAvatarTilt: jest.fn(),
}));
jest.mock("./components/ui.js", () => ({
  initComponents: jest.fn(),
}));

describe("Main Scripts Entry Point", () => {
  let initComponents;
  let initHeroDots;
  let initAvatarTilt;

  beforeEach(async () => {
    jest.resetModules();
    // Re-import to get the mocked functions
    const ui = await import("./components/ui.js");
    const dots = await import("./modules/dot-magnet.js");
    const tilt = await import("./modules/avatar-tilt.js");
    
    initComponents = ui.initComponents;
    initHeroDots = dots.initHeroDots;
    initAvatarTilt = tilt.initAvatarTilt;
    
    // Set document.readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true
    });
  });

  test("should call initialisers when page is loaded", async () => {
    await import("./scripts.js");
    
    expect(initComponents).toHaveBeenCalled();
    expect(initHeroDots).toHaveBeenCalled();
    expect(initAvatarTilt).toHaveBeenCalled();
  });

  test("should handle module system initialisation", async () => {
    const mockModule = { name: "test", init: jest.fn() };
    window.SiteFeatureModules = [mockModule];
    
    await import("./scripts.js");
    
    expect(mockModule.init).toHaveBeenCalled();
  });
});
