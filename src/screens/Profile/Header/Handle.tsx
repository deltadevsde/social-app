import {View} from 'react-native'
import {type AppBskyActorDefs} from '@atproto/api'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {isInvalidHandle, sanitizeHandle} from '#/lib/strings/handles'
import {isIOS, isNative} from '#/platform/detection'
import {type Shadow} from '#/state/cache/types'
import {useSession} from '#/state/session'
import {atoms as a, useTheme, web} from '#/alf'
import {NewskieDialog} from '#/components/NewskieDialog'
import {Text} from '#/components/Typography'

export function ProfileHeaderHandle({
  profile,
  disableTaps,
}: {
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
  disableTaps?: boolean
}) {
  const t = useTheme()
  const {_} = useLingui()
  const {currentAccount} = useSession()
  console.log(profile)
  const handle = currentAccount?.handle || profile.handle
  const invalidHandle = isInvalidHandle(handle)
  const blockHide = profile.viewer?.blocking || profile.viewer?.blockedBy
  return (
    <View
      style={[a.flex_row, a.gap_sm, a.align_center, {maxWidth: '100%'}]}
      pointerEvents={disableTaps ? 'none' : isIOS ? 'auto' : 'box-none'}>
      <NewskieDialog profile={profile} disabled={disableTaps} />
      {profile.viewer?.followedBy && !blockHide ? (
        <View style={[t.atoms.bg_contrast_25, a.rounded_xs, a.px_sm, a.py_xs]}>
          <Text style={[t.atoms.text, a.text_sm]}>
            <Trans>Follows you</Trans>
          </Text>
        </View>
      ) : undefined}
      <Text
        emoji
        numberOfLines={1}
        style={[
          invalidHandle
            ? [
                a.border,
                a.text_xs,
                a.px_sm,
                a.py_xs,
                a.rounded_xs,
                {borderColor: t.palette.contrast_200},
              ]
            : [a.text_md, a.leading_snug, t.atoms.text_contrast_medium],
          web({
            wordBreak: 'break-all',
            direction: 'ltr',
            unicodeBidi: 'isolate',
          }),
        ]}>
        {invalidHandle
          ? currentAccount?.handle || _(msg`⚠Invalid Handle`)
          : sanitizeHandle(
              handle,
              currentAccount?.handle,
              '@',
              // forceLTR handled by CSS above on web
              isNative,
            )}
      </Text>
    </View>
  )
}
