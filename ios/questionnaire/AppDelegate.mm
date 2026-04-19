#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSString *nodePath = [NSProcessInfo processInfo].environment[@"NODE_BINARY"];
  if (!nodePath) {
    setenv("NODE_BINARY", "/usr/local/bin/node", 1);
  }
  
  self.moduleName = @"questionnaire";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// ... existing code ... 