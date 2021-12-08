import { useCallback } from 'react'
import { useColorScheme } from 'react-native'

import { View, Gradient, Pressable } from 'design-system'
import { tw } from 'design-system/tailwind'
import { Home, HomeFilled, Compass, CompassFilled, Hot, HotFilled, Bell, BellFilled } from 'design-system/icon'
import { useRouter } from 'app/navigation/use-router'

function TabBarIcon({ tab, children }) {
	const router = useRouter()

	return (
		<Pressable
			tw="bg-white dark:bg-gray-900 md:dark:bg-gray-800 rounded-[20] w-10 h-10 items-center justify-center"
			// @ts-expect-error web only
			onMouseEnter={() => {
				router.prefetch(tab)
			}}
			onPress={() => {
				router.push(tab)
			}}
			animate={useCallback(({ hovered }) => {
				'worklet'

				return hovered ? tw.style('bg-gray-100 dark:bg-gray-800 md:dark:bg-gray-700') : null
			}, [])}
		>
			{children}
		</Pressable>
	)
}

export const HomeTabBarIcon = ({ color, focused }) => {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<TabBarIcon tab="/">
			{focused ? (
				<View tw="rounded-[20] w-10 h-10 items-center justify-center">
					<Gradient borderRadius={20} colors={['#4C1D95', '#8B5CF6', '#C4B5FD']} locations={[0, 0.6, 1]} />
					<HomeFilled
						style={tw.style('z-1')}
						width={24}
						height={24}
						color={focused && !isDark ? '#fff' : color}
					/>
				</View>
			) : (
				<Home style={tw.style('z-1')} width={24} height={24} color={color} />
			)}
		</TabBarIcon>
	)
}

export const DiscoverTabBarIcon = ({ color, focused }) => {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<TabBarIcon tab="/discover">
			{focused ? (
				<View tw="rounded-[20] w-10 h-10 items-center justify-center">
					<Gradient borderRadius={20} colors={['#4C1D95', '#8B5CF6', '#C4B5FD']} locations={[0, 0.6, 1]} />
					<CompassFilled
						style={tw.style('z-1')}
						width={24}
						height={24}
						color={focused && !isDark ? '#fff' : color}
					/>
				</View>
			) : (
				<Compass style={tw.style('z-1')} width={24} height={24} color={color} />
			)}
		</TabBarIcon>
	)
}

export const TrendingTabBarIcon = ({ color, focused }) => {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<TabBarIcon tab="/trending">
			{focused ? (
				<View tw="rounded-[20] w-10 h-10 items-center justify-center">
					<Gradient borderRadius={20} colors={['#4C1D95', '#8B5CF6', '#C4B5FD']} locations={[0, 0.6, 1]} />
					<HotFilled
						style={tw.style('z-1')}
						width={24}
						height={24}
						color={focused && !isDark ? '#fff' : color}
					/>
				</View>
			) : (
				<Hot style={tw.style('z-1')} width={24} height={24} color={color} />
			)}
		</TabBarIcon>
	)
}

export const NotificationsTabBarIcon = ({ color, focused }) => {
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<TabBarIcon tab="/notifications">
			{focused ? (
				<View tw="rounded-[20] w-10 h-10 items-center justify-center">
					<Gradient borderRadius={20} colors={['#4C1D95', '#8B5CF6', '#C4B5FD']} locations={[0, 0.6, 1]} />
					<BellFilled
						style={tw.style('z-1')}
						width={24}
						height={24}
						color={focused && !isDark ? '#fff' : color}
					/>
				</View>
			) : (
				<Bell style={tw.style('z-1')} width={24} height={24} color={color} />
			)}
		</TabBarIcon>
	)
}