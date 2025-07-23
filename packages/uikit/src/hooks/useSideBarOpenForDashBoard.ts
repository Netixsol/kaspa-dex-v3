
let sidebarOpen = false;
let listeners: ((val: boolean) => void)[] = [];

export const getSidebarOpen = () => sidebarOpen;

export const setSidebarOpen = (val: boolean) => {
  sidebarOpen = val;
  listeners.forEach((cb) => cb(val));
};

export const subscribeToSidebar = (cb: (val: boolean) => void) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};