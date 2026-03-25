import { Href, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../../components/Layout';

export default function NavItem({
  icon: Icon,
  label,
  href,
}: {
  icon: React.FC<{ width?: number; height?: number; stroke?: string }>;
  label: string;
  href: Href;
}) {
  const router = useRouter();
  const pathnameRaw = usePathname();

  const pathname = typeof pathnameRaw === 'string' ? pathnameRaw : '/';

  // Highlight active if pathname starts with href
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href as string);

  const handlePress = () => {
    if (!isActive) {
      router.replace(href); // keep href typed
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.navItem}>
      <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
        <Icon
          width={24}
          height={24}
          stroke={isActive ? '#820933' : '#999'}
        />
      </View>

      <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}