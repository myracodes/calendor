import { Document } from "@react-pdf/renderer"
import type { BujoSettings } from "../bujo/types"
import { BujoPage } from "./BujoPage"

/** Document PDF "BuJo factory" : N pages identiques du tableau paramétré. */
export function BujoDocument({ settings }: { settings: BujoSettings }) {
  return (
    <Document>
      {Array.from({ length: settings.pageCount }, (_, i) => (
        <BujoPage key={i} settings={settings} />
      ))}
    </Document>
  )
}
