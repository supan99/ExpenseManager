import {useCallback} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';

const useCameraHooks = () => {

  const openSettingsAlert = useCallback(({title}: {title: string}) => {
    Alert.alert(title, '', [
      {
        isPreferred: true,
        style: 'default',
        text: 'Open Settings',
        onPress: () => Linking?.openSettings(),
      },
      {
        isPreferred: false,
        style: 'destructive',
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  }, []);

  const checkAndroidGalleryPermissions = useCallback(async () => {
    console.log('checkAndroidGalleryPermissions');
    if (parseInt(Platform.Version as string, 10) >= 33) {
      const permissions = await Permissions.checkMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ]);
      if (
        permissions[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
        RESULTS.GRANTED
      ) {
        return true;
      }
      const res = await Permissions.requestMultiple([
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ]);
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
        RESULTS.GRANTED
      ) {
        return true;
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
        RESULTS.DENIED
      ) {
        return await checkAndroidGalleryPermissions();
      }
      if (
        res[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] ===
        RESULTS.BLOCKED
      ) {
        openSettingsAlert({
          title: 'Please allow access to your photos and videos from settings to upload profile picture and event photos',
        });
        return false;
      }
    } else {
      const permission = await Permissions.check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (permission === RESULTS.GRANTED || permission === RESULTS.LIMITED) {
        return true;
      }
      const res = await Permissions.request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      if (res === RESULTS.GRANTED || res === RESULTS.LIMITED) {
        return true;
      }
      if (res === RESULTS.DENIED) {
        return await checkAndroidGalleryPermissions();
      }
      if (res === RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow access to the photo library from settings to upload profile picture and event photos',
        });
        return false;
      }
    }
    return false;
  }, [openSettingsAlert]);

  const checkAndroidCameraPermissions = useCallback(async () => {
    console.log('checkAndroidCameraPermissions');
    const permission = await Permissions.check(PERMISSIONS.ANDROID.CAMERA);
    if (permission === RESULTS.GRANTED) {
      return true;
    }
    const res = await Permissions.request(PERMISSIONS.ANDROID.CAMERA);
    if (res === RESULTS.GRANTED) {
      return true;
    }
    if (res === RESULTS.DENIED) {
      return await checkAndroidCameraPermissions();
    }
    if (res === RESULTS.BLOCKED) {
      openSettingsAlert({
        title: 'Please allow camera access from settings to take photos',
      });
      return false;
    }
    return false;
  }, [openSettingsAlert]);

  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return await checkAndroidCameraPermissions();
    } else {
      console.log('ios camera');
      const permission = await Permissions.check(PERMISSIONS.IOS.CAMERA);
      if (permission === RESULTS.GRANTED) {
        return true;
      }
      const res = await Permissions.request(PERMISSIONS.IOS.CAMERA);
      if (res === RESULTS.GRANTED) {
        return true;
      }
      if (res === RESULTS.DENIED) {
        return await checkCameraPermission();
      }
      if (res === RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow camera access from settings to take photos',
        });
        return false;
      }
    }
    return false;
  }, [openSettingsAlert, checkAndroidCameraPermissions]);

  const checkGalleryPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return await checkAndroidGalleryPermissions();
    } else {
      console.log('ios gallery');
      const permission = await Permissions.check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (permission === RESULTS.GRANTED || permission === RESULTS.LIMITED) {
        return true;
      }
      const res = await Permissions.request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (res === RESULTS.GRANTED || res === RESULTS.LIMITED) {
        return true;
      }
      if (res === RESULTS.DENIED) {
        return await checkGalleryPermission();
      }
      if (res === RESULTS.BLOCKED) {
        openSettingsAlert({
          title: 'Please allow access to the photo library from settings to upload profile picture and event photos',
        });
        return false;
      }
    }
    return false;
  }, [openSettingsAlert, checkAndroidGalleryPermissions]);

  return {
    checkCameraPermission,
    checkGalleryPermission,
  };
};

export default useCameraHooks;
