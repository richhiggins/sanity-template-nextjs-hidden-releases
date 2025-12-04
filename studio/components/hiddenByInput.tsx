// ./components/hiddenByInput.tsx
import {useEffect} from 'react'
import {set, StringInputProps, usePerspective} from 'sanity'

export default function HiddenByInput(props: StringInputProps) {
  const {renderDefault, onChange, readOnly, value} = props
  const perspective = usePerspective()

  // @ts-ignore
  const perspectiveId = perspective.selectedPerspective.metadata?.hidden
    ? // @ts-ignore
      perspective.selectedPerspective._id
    : undefined

  useEffect(() => {
    // if the document is not read-only and the perspective id is set, set the value
    if (!readOnly && perspectiveId) {
      onChange(set(perspectiveId))
    }
  }, [readOnly])

  return renderDefault({...props})
}
