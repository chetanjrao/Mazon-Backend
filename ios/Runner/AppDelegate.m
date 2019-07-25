#include "AppDelegate.h"
#include "GeneratedPluginRegistrant.h"
#import "GoogleMaps/GoogleMaps.h"
@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [GeneratedPluginRegistrant registerWithRegistry:self];
  [GMSServices provideAPIKey: @"AIzaSyATQYPs4OXLsODbsyqK5eQTRM_jIujnbUw"];
  // Override point for customization after application launch.
    [FIRApp configure];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
