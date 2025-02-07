import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FF5757', 
        tabBarInactiveTintColor: '#9CA3AF', 
        tabBarStyle: {
          backgroundColor: '#121212', 
          height: 80,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -4 },
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        tabBarIcon: ({ focused, color }) => {
          const iconSize = 28;
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case '(movie)/allMovies':
              iconName = focused ? 'film' : 'film-outline';
              break;
            case '(showtime)/showTimes':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case '(tabs)/profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          color: '#E4E4E7',
        },
        headerShown: false,
      })}
    >

      <Tabs.Screen 
        name="Home"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen 
        name="(movie)/allMovies"
        options={{ title: 'Movies' }}
      />
      <Tabs.Screen 
        name="(showtime)/showTimes"
        options={{ title: 'Showtimes' }}
      />
     

      <Tabs.Screen name="(movie)/moviePage" options={{ href: null }} />
      <Tabs.Screen name="(showtime)/showTimePage" options={{ href: null }} />
      <Tabs.Screen name="(showtime)/resrvationPage" options={{ href: null }} />
    </Tabs>
  );
}
