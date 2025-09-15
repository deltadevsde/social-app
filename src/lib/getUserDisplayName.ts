import {sanitizeDisplayName} from '#/lib/strings/display-names'
import {sanitizeHandle} from '#/lib/strings/handles'

export function getUserDisplayName<
  T extends {displayName?: string; handle: string; [key: string]: any},
>(props: T, fallbackHandle: string | undefined): string {
  return sanitizeDisplayName(
    props.displayName || sanitizeHandle(props.handle, fallbackHandle, '@'),
  )
}
