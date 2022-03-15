import { Suspense } from "react";

import { ErrorBoundary } from "app/components/error-boundary";
import { useUser } from "app/hooks/use-user";
import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { formatAddressShort } from "app/lib/utilities";
import { useRouter } from "app/navigation/use-router";

import { View, Pressable, Image } from "design-system";
import {
  Home,
  HomeFilled,
  Compass,
  CompassFilled,
  Hot,
  HotFilled,
  Bell,
  BellFilled,
  Plus,
} from "design-system/icon";
import { tw } from "design-system/tailwind";

import { useNotifications } from "../hooks/use-notifications";

function TabBarIcon({ tab, children }) {
  const router = useRouter();

  return children;
  return (
    <Pressable
      tw={[
        "md:bg-white md:dark:bg-gray-800 rounded-[20] w-12 h-12 items-center justify-center",
      ]}
      // @ts-expect-error web only
      onMouseEnter={() => {
        router.prefetch(tab);
      }}
      onPress={() => {
        router.push(tab);
      }}
      // animate={useCallback(({ hovered }) => {
      // 	'worklet'

      // 	return hovered
      // 		? tw.style('bg-gray-100 dark:bg-gray-800 md:dark:bg-gray-700')
      // 		: tw.style('bg-white dark:bg-gray-900 md:dark:bg-gray-800')
      // }, [])}
    >
      {children}
    </Pressable>
  );
}

export const HomeTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <HomeFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Home style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const MarketplaceTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/marketplace">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <CompassFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Compass style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const CameraTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/camera">
      <View
        tw={[
          "rounded-full h-12 w-12 justify-center items-center",
          focused ? "bg-gray-100 dark:bg-gray-900" : "bg-black dark:bg-white",
        ]}
      >
        <Plus
          width={24}
          height={24}
          color={
            tw.style(
              focused ? "bg-black dark:bg-white" : "bg-white dark:bg-black"
            )?.backgroundColor as string
          }
        />
      </View>
    </TabBarIcon>
  );
};

export const TrendingTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/trending">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <HotFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Hot style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
    </TabBarIcon>
  );
};

export const NotificationsTabBarIcon = ({ color, focused }) => {
  return (
    <TabBarIcon tab="/notifications">
      {focused ? (
        <View tw="rounded-[20] w-10 h-10 items-center justify-center">
          <BellFilled
            style={tw.style("z-1")}
            width={24}
            height={24}
            color={color}
          />
        </View>
      ) : (
        <Bell style={tw.style("z-1")} width={24} height={24} color={color} />
      )}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <UnreadNotificationIndicator />
        </Suspense>
      </ErrorBoundary>
    </TabBarIcon>
  );
};

const UnreadNotificationIndicator = () => {
  const { hasUnreadNotification } = useNotifications();

  return hasUnreadNotification ? (
    <View tw="w-2 h-2 bg-violet-500 absolute rounded-full bottom-2" />
  ) : null;
};

export const ProfileTabBarIcon = () => {
  const { user } = useUser();

  return (
    <View tw="h-8 w-8 items-center justify-center rounded-full">
      <Image
        tw="h-8 w-8 rounded-full"
        source={{
          uri: getSmallImageUrl(
            user?.data.profile?.img_url || DEFAULT_PROFILE_PIC
          ),
        }}
        alt={
          user?.data?.profile?.name ||
          user?.data?.profile?.username ||
          user?.data?.profile?.wallet_addresses_excluding_email_v2?.[0]
            ?.ens_domain ||
          formatAddressShort(
            user?.data?.profile?.wallet_addresses_excluding_email_v2?.[0]
              ?.address
          ) ||
          "Profile"
        }
      />
    </View>
  );
};

const getSmallImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s64";
  }
  return imgUrl;
};
