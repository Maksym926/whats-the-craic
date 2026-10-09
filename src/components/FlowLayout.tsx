import { Outlet } from "react-router-dom"

/** Log in / sign-up steps: full screen on phones, a centred card from tablet up. */
export function FlowLayout() {
  return (
    <div className="flex flex-1 flex-col md:items-center md:justify-center md:px-6 md:py-12">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col md:max-w-[480px] md:flex-none md:overflow-clip md:rounded-tile md:border md:border-line">
        <Outlet />
      </div>
    </div>
  )
}
