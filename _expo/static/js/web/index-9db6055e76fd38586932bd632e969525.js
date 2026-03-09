__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  var _interopRequireDefault = require(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    useCameraPermissions: true,
    useMicrophonePermissions: true,
    scanFromURLAsync: true,
    Camera: true,
    CameraView: true
  };
  exports.Camera = undefined;
  Object.defineProperty(exports, "CameraView", {
    enumerable: true,
    get: function () {
      return _CameraView.default;
    }
  });
  exports.scanFromURLAsync = scanFromURLAsync;
  exports.useMicrophonePermissions = exports.useCameraPermissions = undefined;
  var _expoModulesCore = require(_dependencyMap[1]);
  var _ExpoCameraManager = _interopRequireDefault(require(_dependencyMap[2]));
  var _CameraView = _interopRequireDefault(require(_dependencyMap[3]));
  var _Camera = require(_dependencyMap[4]);
  Object.keys(_Camera).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _Camera[key]) return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _Camera[key];
      }
    });
  });
  // @needsAudit
  /**
   * Checks user's permissions for accessing camera.
   * @return A promise that resolves to an object of type [PermissionResponse](#permissionresponse).
   */
  async function getCameraPermissionsAsync() {
    return _ExpoCameraManager.default.getCameraPermissionsAsync();
  }
  // @needsAudit
  /**
   * Asks the user to grant permissions for accessing camera.
   * On iOS this will require apps to specify an `NSCameraUsageDescription` entry in the **Info.plist**.
   * @return A promise that resolves to an object of type [PermissionResponse](#permissionresponse).
   */
  async function requestCameraPermissionsAsync() {
    return _ExpoCameraManager.default.requestCameraPermissionsAsync();
  }
  // @needsAudit
  /**
   * Check or request permissions to access the camera.
   * This uses both `requestCameraPermissionsAsync` and `getCameraPermissionsAsync` to interact with the permissions.
   *
   * @example
   * ```ts
   * const [status, requestPermission] = useCameraPermissions();
   * ```
   */
  const useCameraPermissions = exports.useCameraPermissions = (0, _expoModulesCore.createPermissionHook)({
    getMethod: getCameraPermissionsAsync,
    requestMethod: requestCameraPermissionsAsync
  });
  // @needsAudit
  /**
   * Checks user's permissions for accessing microphone.
   * @return A promise that resolves to an object of type [PermissionResponse](#permissionresponse).
   */
  async function getMicrophonePermissionsAsync() {
    return _ExpoCameraManager.default.getMicrophonePermissionsAsync();
  }
  // @needsAudit
  /**
   * Asks the user to grant permissions for accessing the microphone.
   * On iOS this will require apps to specify an `NSMicrophoneUsageDescription` entry in the **Info.plist**.
   * @return A promise that resolves to an object of type [PermissionResponse](#permissionresponse).
   */
  async function requestMicrophonePermissionsAsync() {
    return _ExpoCameraManager.default.requestMicrophonePermissionsAsync();
  }
  // @needsAudit
  /**
   * Check or request permissions to access the microphone.
   * This uses both `requestMicrophonePermissionsAsync` and `getMicrophonePermissionsAsync` to interact with the permissions.
   *
   * @example
   * ```ts
   * const [status, requestPermission] = Camera.useMicrophonePermissions();
   * ```
   */
  const useMicrophonePermissions = exports.useMicrophonePermissions = (0, _expoModulesCore.createPermissionHook)({
    getMethod: getMicrophonePermissionsAsync,
    requestMethod: requestMicrophonePermissionsAsync
  });
  /**
   * Scan bar codes from the image at the given URL.
   * @param url URL to get the image from.
   * @param barcodeTypes An array of bar code types. Defaults to all supported bar code types on
   * the platform.
   * > __Note:__ Only QR codes are supported on iOS.
   * On android, the barcode should take up the majority of the image for best results.
   * @return A possibly empty array of objects of the `BarcodeScanningResult` shape, where the type
   * refers to the barcode type that was scanned and the data is the information encoded in the barcode.
   */
  async function scanFromURLAsync(url, barcodeTypes = ['qr']) {
    return _ExpoCameraManager.default.scanFromURLAsync(url, barcodeTypes);
  }
  /**
   * @hidden
   */
  const Camera = exports.Camera = {
    getCameraPermissionsAsync,
    requestCameraPermissionsAsync,
    getMicrophonePermissionsAsync,
    requestMicrophonePermissionsAsync,
    scanFromURLAsync
  };
},736,[33,503,737,740,738]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _expoModulesCore = require(_dependencyMap[0]);
  var _Camera = require(_dependencyMap[1]);
  var _WebUserMediaManager = require(_dependencyMap[2]);
  function getUserMedia(constraints) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    // First get ahold of the legacy getUserMedia, if present
    const getUserMedia =
    // TODO: this method is deprecated, migrate to https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || function () {
      const error = new Error('Permission unimplemented');
      error.code = 0;
      error.name = 'NotAllowedError';
      throw error;
    };
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
  function handleGetUserMediaError({
    message
  }) {
    // name: NotAllowedError
    // code: 0
    if (message === 'Permission dismissed') {
      return {
        status: _Camera.PermissionStatus.UNDETERMINED,
        expires: 'never',
        canAskAgain: true,
        granted: false
      };
    } else {
      // TODO: Bacon: [OSX] The system could deny access to chrome.
      // TODO: Bacon: add: { status: 'unimplemented' }
      return {
        status: _Camera.PermissionStatus.DENIED,
        expires: 'never',
        canAskAgain: true,
        granted: false
      };
    }
  }
  async function handleRequestPermissionsAsync() {
    try {
      await getUserMedia({
        video: true
      });
      return {
        status: _Camera.PermissionStatus.GRANTED,
        expires: 'never',
        canAskAgain: true,
        granted: true
      };
    } catch ({
      message
    }) {
      return handleGetUserMediaError({
        message
      });
    }
  }
  async function handlePermissionsQueryAsync(query) {
    if (!navigator?.permissions?.query) {
      throw new _expoModulesCore.UnavailabilityError('expo-camera', 'navigator.permissions API is not available');
    }
    try {
      const {
        state
      } = await navigator.permissions.query({
        name: query
      });
      switch (state) {
        case 'prompt':
          return {
            status: _Camera.PermissionStatus.UNDETERMINED,
            expires: 'never',
            canAskAgain: true,
            granted: false
          };
        case 'granted':
          return {
            status: _Camera.PermissionStatus.GRANTED,
            expires: 'never',
            canAskAgain: true,
            granted: true
          };
        case 'denied':
          return {
            status: _Camera.PermissionStatus.DENIED,
            expires: 'never',
            canAskAgain: true,
            granted: false
          };
      }
    } catch (e) {
      // Firefox doesn't support querying for the camera permission, so return undetermined status
      if (e instanceof TypeError) {
        return {
          status: _Camera.PermissionStatus.UNDETERMINED,
          expires: 'never',
          canAskAgain: true,
          granted: false
        };
      }
      throw e;
    }
  }
  var _default = exports.default = {
    get Type() {
      return {
        back: 'back',
        front: 'front'
      };
    },
    get FlashMode() {
      return {
        on: 'on',
        off: 'off',
        auto: 'auto',
        torch: 'torch'
      };
    },
    get AutoFocus() {
      return {
        on: 'on',
        off: 'off',
        auto: 'auto',
        singleShot: 'singleShot'
      };
    },
    get WhiteBalance() {
      return {
        auto: 'auto',
        continuous: 'continuous',
        manual: 'manual'
      };
    },
    get VideoQuality() {
      return {};
    },
    get VideoStabilization() {
      return {};
    },
    async isAvailableAsync() {
      return (0, _WebUserMediaManager.canGetUserMedia)();
    },
    async takePicture(options, camera) {
      return await camera.takePicture(options);
    },
    async pausePreview(camera) {
      await camera.pausePreview();
    },
    async resumePreview(camera) {
      return await camera.resumePreview();
    },
    async getAvailableCameraTypesAsync() {
      if (!(0, _WebUserMediaManager.canGetUserMedia)() || !navigator.mediaDevices.enumerateDevices) return [];
      const devices = await navigator.mediaDevices.enumerateDevices();
      const types = await Promise.all([(await (0, _WebUserMediaManager.isFrontCameraAvailableAsync)(devices)) && 'front', (await (0, _WebUserMediaManager.isBackCameraAvailableAsync)()) && 'back']);
      return types.filter(Boolean);
    },
    async getAvailablePictureSizes(ratio, camera) {
      return await camera.getAvailablePictureSizes(ratio);
    },
    /* async getSupportedRatios(camera: ExponentCameraRef): Promise<string[]> {
      // TODO: Support on web
    },
    async record(
      options?: CameraRecordingOptions,
      camera: ExponentCameraRef
    ): Promise<{ uri: string }> {
      // TODO: Support on web
    },
    async stopRecording(camera: ExponentCameraRef): Promise<void> {
      // TODO: Support on web
    }, */
    async getPermissionsAsync() {
      return handlePermissionsQueryAsync('camera');
    },
    async requestPermissionsAsync() {
      return handleRequestPermissionsAsync();
    },
    async getCameraPermissionsAsync() {
      return handlePermissionsQueryAsync('camera');
    },
    async requestCameraPermissionsAsync() {
      return handleRequestPermissionsAsync();
    },
    async getMicrophonePermissionsAsync() {
      return handlePermissionsQueryAsync('microphone');
    },
    async requestMicrophonePermissionsAsync() {
      try {
        await getUserMedia({
          audio: true
        });
        return {
          status: _Camera.PermissionStatus.GRANTED,
          expires: 'never',
          canAskAgain: true,
          granted: true
        };
      } catch ({
        message
      }) {
        return handleGetUserMediaError({
          message
        });
      }
    }
  };
},737,[503,738,739]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "PermissionStatus", {
    enumerable: true,
    get: function () {
      return _expoModulesCore.PermissionStatus;
    }
  });
  var _expoModulesCore = require(_dependencyMap[0]);
},738,[503]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.canGetUserMedia = canGetUserMedia;
  exports.getAnyUserMediaAsync = getAnyUserMediaAsync;
  exports.getUserMediaAsync = getUserMediaAsync;
  exports.isBackCameraAvailableAsync = isBackCameraAvailableAsync;
  exports.isFrontCameraAvailableAsync = isFrontCameraAvailableAsync;
  exports.mountedInstances = undefined;
  exports.requestUserMediaAsync = requestUserMediaAsync;
  exports.userMediaRequested = undefined;
  var _expoModulesCore = require(_dependencyMap[0]);
  /* eslint-env browser */
  /**
   * A web-only module for ponyfilling the UserMedia API.
   */

  const userMediaRequested = exports.userMediaRequested = false;
  const mountedInstances = exports.mountedInstances = [];
  async function requestLegacyUserMediaAsync(props) {
    const optionalSource = id => ({
      optional: [{
        sourceId: id
      }]
    });
    const constraintToSourceId = constraint => {
      const {
        deviceId
      } = constraint;
      if (typeof deviceId === 'string') {
        return deviceId;
      }
      if (Array.isArray(deviceId) && deviceId.length > 0) {
        return deviceId[0];
      }
      if (typeof deviceId === 'object' && deviceId.ideal) {
        return deviceId.ideal;
      }
      return null;
    };
    const sources = await new Promise(resolve =>
    // @ts-ignore: https://caniuse.com/#search=getSources Chrome for Android (78) & Samsung Internet (10.1) use this
    MediaStreamTrack.getSources(sources => resolve(sources)));
    let audioSource = null;
    let videoSource = null;
    sources.forEach(source => {
      if (source.kind === 'audio') {
        audioSource = source.id;
      } else if (source.kind === 'video') {
        videoSource = source.id;
      }
    });
    const audioSourceId = constraintToSourceId(props.audioConstraints);
    if (audioSourceId) {
      audioSource = audioSourceId;
    }
    const videoSourceId = constraintToSourceId(props.videoConstraints);
    if (videoSourceId) {
      videoSource = videoSourceId;
    }
    return [optionalSource(audioSource), optionalSource(videoSource)];
  }
  async function sourceSelectedAsync(isMuted, audioConstraints, videoConstraints) {
    const constraints = {
      video: typeof videoConstraints !== 'undefined' ? videoConstraints : true
    };
    if (!isMuted) {
      constraints.audio = typeof audioConstraints !== 'undefined' ? audioConstraints : true;
    }
    return await getAnyUserMediaAsync(constraints);
  }
  async function requestUserMediaAsync(props, isMuted = true) {
    if (canGetUserMedia()) {
      return await sourceSelectedAsync(isMuted, props.audio, props.video);
    }
    const [audio, video] = await requestLegacyUserMediaAsync(props);
    return await sourceSelectedAsync(isMuted, audio, video);
  }
  async function getAnyUserMediaAsync(constraints, ignoreConstraints = false) {
    try {
      return await getUserMediaAsync(Object.assign({}, constraints, {
        video: ignoreConstraints || constraints.video
      }));
    } catch (error) {
      if (!ignoreConstraints && error.name === 'ConstraintNotSatisfiedError') {
        return await getAnyUserMediaAsync(constraints, true);
      }
      throw error;
    }
  }
  async function getUserMediaAsync(constraints) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }
    const _getUserMedia = navigator['mozGetUserMedia'] || navigator['webkitGetUserMedia'] || navigator['msGetUserMedia'];
    return new Promise((resolve, reject) => _getUserMedia.call(navigator, constraints, resolve, reject));
  }
  function canGetUserMedia() {
    return (
      // SSR
      _expoModulesCore.Platform.isDOMAvailable &&
      // Has any form of media API
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia || navigator['mozGetUserMedia'] || navigator['webkitGetUserMedia'] || navigator['msGetUserMedia'])
    );
  }
  async function isFrontCameraAvailableAsync(devices) {
    return await supportsCameraType(['front', 'user', 'facetime'], 'user', devices);
  }
  async function isBackCameraAvailableAsync(devices) {
    return await supportsCameraType(['back', 'rear'], 'environment', devices);
  }
  async function supportsCameraType(labels, type, devices) {
    if (!devices) {
      if (!navigator.mediaDevices.enumerateDevices) {
        return null;
      }
      devices = await navigator.mediaDevices.enumerateDevices();
    }
    const cameras = devices.filter(t => t.kind === 'videoinput');
    const [hasCamera] = cameras.filter(camera => labels.some(label => camera.label.toLowerCase().includes(label)));
    const [isCapable] = cameras.filter(camera => {
      if (!('getCapabilities' in camera)) {
        return null;
      }
      const capabilities = camera.getCapabilities();
      if (!capabilities.facingMode) {
        return null;
      }
      return capabilities.facingMode.find(_ => type);
    });
    return isCapable?.deviceId || hasCamera?.deviceId || null;
  }
},739,[503]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  var _interopRequireDefault = require(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _expoModulesCore = require(_dependencyMap[1]);
  var _react = require(_dependencyMap[2]);
  var _ExpoCamera = _interopRequireDefault(require(_dependencyMap[3]));
  var _ExpoCameraManager = _interopRequireDefault(require(_dependencyMap[4]));
  var _props = require(_dependencyMap[5]);
  var _jsxRuntime = require(_dependencyMap[6]);
  const EventThrottleMs = 500;
  const _PICTURE_SAVED_CALLBACKS = {};
  let _GLOBAL_PICTURE_ID = 1;
  function ensurePictureOptions(options) {
    if (!options || typeof options !== 'object') {
      return {};
    }
    if (options.quality === undefined) {
      options.quality = 1;
    }
    if (options.mirror) {
      console.warn('The `mirror` option is deprecated. Please use the `mirror` prop on the `CameraView` instead.');
    }
    if (options.onPictureSaved) {
      const id = _GLOBAL_PICTURE_ID++;
      _PICTURE_SAVED_CALLBACKS[id] = options.onPictureSaved;
      options.id = id;
      options.fastMode = true;
    }
    return options;
  }
  function ensureRecordingOptions(options = {}) {
    if (!options || typeof options !== 'object') {
      return {};
    }
    if (options.mirror) {
      console.warn('The `mirror` option is deprecated. Please use the `mirror` prop on the `CameraView` instead.');
    }
    return options;
  }
  function _onPictureSaved({
    nativeEvent
  }) {
    const {
      id,
      data
    } = nativeEvent;
    const callback = _PICTURE_SAVED_CALLBACKS[id];
    if (callback) {
      callback(data);
      delete _PICTURE_SAVED_CALLBACKS[id];
    }
  }
  class CameraView extends _react.Component {
    /**
     * Property that determines if the current device has the ability to use `DataScannerViewController` (iOS 16+).
     */
    static isModernBarcodeScannerAvailable = _ExpoCameraManager.default.isModernBarcodeScannerAvailable;
    /**
     * Check whether the current device has a camera. This is useful for web and simulators cases.
     * This isn't influenced by the Permissions API (all platforms), or HTTP usage (in the browser).
     * You will still need to check if the native permission has been accepted.
     * @platform web
     */
    static async isAvailableAsync() {
      if (!_ExpoCameraManager.default.isAvailableAsync) {
        throw new _expoModulesCore.UnavailabilityError('expo-camera', 'isAvailableAsync');
      }
      return await _ExpoCameraManager.default.isAvailableAsync();
    }
    // @needsAudit
    /**
     * Queries the device for the available video codecs that can be used in video recording.
     * @return A promise that resolves to a list of strings that represents available codecs.
     * @platform ios
     */
    static async getAvailableVideoCodecsAsync() {
      if (!_ExpoCameraManager.default.getAvailableVideoCodecsAsync) {
        throw new _expoModulesCore.UnavailabilityError('Camera', 'getAvailableVideoCodecsAsync');
      }
      return await _ExpoCameraManager.default.getAvailableVideoCodecsAsync();
    }
    /**
     * Get picture sizes that are supported by the device.
     * @return Returns a Promise that resolves to an array of strings representing picture sizes that can be passed to `pictureSize` prop.
     * The list varies across Android devices but is the same for every iOS.
     */
    async getAvailablePictureSizesAsync() {
      return (await this._cameraRef.current?.getAvailablePictureSizes()) ?? [];
    }
    /**
     * Resumes the camera preview.
     */
    async resumePreview() {
      return this._cameraRef.current?.resumePreview();
    }
    /**
     * Pauses the camera preview. It is not recommended to use `takePictureAsync` when preview is paused.
     */
    async pausePreview() {
      return this._cameraRef.current?.pausePreview();
    }
    // Values under keys from this object will be transformed to native options
    static ConversionTables = _props.ConversionTables;
    static defaultProps = {
      zoom: 0,
      facing: 'back',
      enableTorch: false,
      mode: 'picture',
      flash: 'off'
    };
    _cameraRef = /*#__PURE__*/(0, _react.createRef)();
    _lastEvents = {};
    _lastEventsTimes = {};
    // @needsAudit
    /**
     * Takes a picture and saves it to app's cache directory. Photos are rotated to match device's orientation
     * (if `options.skipProcessing` flag is not enabled) and scaled to match the preview.
     * > **Note**: Make sure to wait for the [`onCameraReady`](#oncameraready) callback before calling this method.
     * @param options An object in form of `CameraPictureOptions` type.
     * @return Returns a Promise that resolves to `CameraCapturedPicture` object, where `uri` is a URI to the local image file on Android,
     * iOS, and a base64 string on web (usable as the source for an `Image` element). The `width` and `height` properties specify
     * the dimensions of the image.
     *
     * `base64` is included if the `base64` option was truthy, and is a string containing the JPEG data
     * of the image in Base64. Prepend it with `'data:image/jpg;base64,'` to get a data URI, which you can use as the source
     * for an `Image` element for example.
     *
     * `exif` is included if the `exif` option was truthy, and is an object containing EXIF
     * data for the image. The names of its properties are EXIF tags and their values are the values for those tags.
     *
     * > On native platforms, the local image URI is temporary. Use [`FileSystem.copyAsync`](filesystem/#filesystemcopyasyncoptions)
     * > to make a permanent copy of the image.
     *
     * > **Note:** Avoid calling this method while the preview is paused. On Android, this will throw an error. On iOS, this will take a picture of the last frame that is currently on screen.
     */
    async takePictureAsync(options) {
      const pictureOptions = ensurePictureOptions(options);
      return this._cameraRef.current?.takePicture(pictureOptions);
    }
    /**
     * Presents a modal view controller that uses the [`DataScannerViewController`](https://developer.apple.com/documentation/visionkit/scanning_data_with_the_camera) available on iOS 16+.
     * @platform ios
     */
    static async launchScanner(options) {
      if (!options) {
        options = {
          barcodeTypes: []
        };
      }
    }
    /**
     * Dismiss the scanner presented by `launchScanner`.
     * @platform ios
     */
    static async dismissScanner() {}
    /**
     * Invokes the `listener` function when a bar code has been successfully scanned. The callback is provided with
     * an object of the `ScanningResult` shape, where the `type` refers to the bar code type that was scanned and the `data` is the information encoded in the bar code
     * (in this case of QR codes, this is often a URL). See [`BarcodeType`](#barcodetype) for supported values.
     * @param listener Invoked with the [ScanningResult](#scanningresult) when a bar code has been successfully scanned.
     *
     * @platform ios
     */
    static onModernBarcodeScanned(listener) {
      return _ExpoCameraManager.default.addListener('onModernBarcodeScanned', listener);
    }
    /**
     * Starts recording a video that will be saved to cache directory. Videos are rotated to match device's orientation.
     * Flipping camera during a recording results in stopping it.
     * @param options A map of `CameraRecordingOptions` type.
     * @return Returns a Promise that resolves to an object containing video file `uri` property and a `codec` property on iOS.
     * The Promise is returned if `stopRecording` was invoked, one of `maxDuration` and `maxFileSize` is reached or camera preview is stopped.
     * @platform android
     * @platform ios
     */
    async recordAsync(options) {
      const recordingOptions = ensureRecordingOptions(options);
      return this._cameraRef.current?.record(recordingOptions);
    }
    /**
     * Stops recording if any is in progress.
     */
    stopRecording() {
      this._cameraRef.current?.stopRecording();
    }
    _onCameraReady = () => {
      if (this.props.onCameraReady) {
        this.props.onCameraReady();
      }
    };
    _onMountError = ({
      nativeEvent
    }) => {
      if (this.props.onMountError) {
        this.props.onMountError(nativeEvent);
      }
    };
    _onResponsiveOrientationChanged = ({
      nativeEvent
    }) => {
      if (this.props.onResponsiveOrientationChanged) {
        this.props.onResponsiveOrientationChanged(nativeEvent);
      }
    };
    _onObjectDetected = callback => ({
      nativeEvent
    }) => {
      const {
        type
      } = nativeEvent;
      if (this._lastEvents[type] && this._lastEventsTimes[type] && JSON.stringify(nativeEvent) === this._lastEvents[type] && new Date().getTime() - this._lastEventsTimes[type].getTime() < EventThrottleMs) {
        return;
      }
      if (callback) {
        callback(nativeEvent);
        this._lastEventsTimes[type] = new Date();
        this._lastEvents[type] = JSON.stringify(nativeEvent);
      }
    };
    _setReference = ref => {
      if (ref) {
        // TODO(Bacon): Unify these - perhaps with hooks?
        {
          this._cameraHandle = ref;
        }
      }
    };
    render() {
      const nativeProps = (0, _props.ensureNativeProps)(this.props);
      const onBarcodeScanned = this.props.onBarcodeScanned ? this._onObjectDetected(this.props.onBarcodeScanned) : undefined;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ExpoCamera.default, Object.assign({}, nativeProps, {
        ref: this._cameraRef,
        onCameraReady: this._onCameraReady,
        onMountError: this._onMountError,
        onBarcodeScanned: onBarcodeScanned,
        onPictureSaved: _onPictureSaved,
        onResponsiveOrientationChanged: this._onResponsiveOrientationChanged
      }));
    }
  }
  exports.default = CameraView;
},740,[33,503,15,741,737,747,13]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  var _interopRequireDefault = require(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require(_dependencyMap[1]));
  var _expoModulesCore = require(_dependencyMap[2]);
  var _react = require(_dependencyMap[3]);
  var _StyleSheet = _interopRequireDefault(require(_dependencyMap[4]));
  var _View = _interopRequireDefault(require(_dependencyMap[5]));
  var _createElement = _interopRequireDefault(require(_dependencyMap[6]));
  var _ExpoCameraManager = _interopRequireDefault(require(_dependencyMap[7]));
  var _WebCameraUtils = require(_dependencyMap[8]);
  var _WebConstants = require(_dependencyMap[9]);
  var _useWebCameraStream = require(_dependencyMap[10]);
  var _useWebQRScanner = require(_dependencyMap[11]);
  var _jsxRuntime = require(_dependencyMap[12]);
  const _excluded = ["facing", "poster"];
  const ExponentCamera = /*#__PURE__*/(0, _react.forwardRef)((_ref, ref) => {
    let {
        facing,
        poster
      } = _ref,
      props = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
    const video = (0, _react.useRef)(null);
    const native = (0, _useWebCameraStream.useWebCameraStream)(video, facing, props, {
      onCameraReady() {
        if (props.onCameraReady) {
          props.onCameraReady();
        }
      },
      onMountError: props.onMountError
    });
    const isQRScannerEnabled = (0, _react.useMemo)(() => {
      return Boolean(props.barcodeScannerSettings?.barcodeTypes?.includes('qr') && !!props.onBarcodeScanned);
    }, [props.barcodeScannerSettings?.barcodeTypes, props.onBarcodeScanned]);
    (0, _useWebQRScanner.useWebQRScanner)(video, {
      interval: 300,
      isEnabled: isQRScannerEnabled,
      captureOptions: {
        scale: 1,
        isImageMirror: native.type === 'front'
      },
      onScanned(event) {
        if (props.onBarcodeScanned) {
          props.onBarcodeScanned(event);
        }
      }
    });
    (0, _react.useImperativeHandle)(ref, () => ({
      async getAvailablePictureSizes() {
        return _WebConstants.PictureSizes;
      },
      async takePicture(options) {
        if (!video.current || video.current?.readyState !== video.current?.HAVE_ENOUGH_DATA) {
          throw new _expoModulesCore.CodedError('ERR_CAMERA_NOT_READY', 'HTMLVideoElement does not have enough camera data to construct an image yet.');
        }
        const settings = native.mediaTrackSettings;
        if (!settings) {
          throw new _expoModulesCore.CodedError('ERR_CAMERA_NOT_READY', 'MediaStream is not ready yet.');
        }
        return (0, _WebCameraUtils.capture)(video.current, settings, Object.assign({}, options, {
          // This will always be defined, the option gets added to a queue in the upper-level. We should replace the original so it isn't called twice.
          onPictureSaved(picture) {
            if (options.onPictureSaved) {
              options.onPictureSaved(picture);
            }
            if (props.onPictureSaved) {
              props.onPictureSaved({
                nativeEvent: {
                  data: picture,
                  id: -1
                }
              });
            }
          }
        }));
      },
      async resumePreview() {
        if (video.current) {
          video.current.play();
        }
      },
      async pausePreview() {
        if (video.current) {
          video.current.pause();
        }
      }
    }), [native.mediaTrackSettings, props.onPictureSaved]);
    // TODO(Bacon): Create a universal prop, on native the microphone is only used when recording videos.
    // Because we don't support recording video in the browser we don't need the user to give microphone permissions.
    const isMuted = true;
    const style = (0, _react.useMemo)(() => {
      const isFrontFacingCamera = native.type === _ExpoCameraManager.default.Type.front;
      return [_StyleSheet.default.absoluteFill, styles.video, {
        // Flip the camera
        transform: isFrontFacingCamera ? [{
          scaleX: -1
        }] : undefined
      }];
    }, [native.type]);
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_View.default, {
      pointerEvents: "box-none",
      style: [styles.videoWrapper, props.style],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(Video, {
        autoPlay: true,
        playsInline: true,
        muted: isMuted,
        poster: poster,
        pointerEvents: props.pointerEvents,
        ref: video,
        style: style
      }), props.children]
    });
  });
  var _default = exports.default = ExponentCamera;
  const Video = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => (0, _createElement.default)('video', Object.assign({}, props, {
    ref
  })));
  const styles = _StyleSheet.default.create({
    videoWrapper: {
      flex: 1,
      alignItems: 'stretch'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  });
},741,[33,24,503,15,157,272,151,737,742,744,745,746,13]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  var _interopRequireDefault = require(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.capture = capture;
  exports.captureImage = captureImage;
  exports.captureImageContext = captureImageContext;
  exports.captureImageData = captureImageData;
  exports.compareStreams = compareStreams;
  exports.getIdealConstraints = getIdealConstraints;
  exports.getImageSize = getImageSize;
  exports.getPreferredStreamDevice = getPreferredStreamDevice;
  exports.getStreamDevice = getStreamDevice;
  exports.hasValidConstraints = hasValidConstraints;
  exports.isCapabilityAvailable = isCapabilityAvailable;
  exports.isWebKit = isWebKit;
  exports.setVideoSource = setVideoSource;
  exports.stopMediaStream = stopMediaStream;
  exports.syncTrackCapabilities = syncTrackCapabilities;
  exports.toDataURL = toDataURL;
  var _invariant = _interopRequireDefault(require(_dependencyMap[1]));
  var CapabilityUtils = _interopRequireWildcard(require(_dependencyMap[2]));
  var _WebConstants = require(_dependencyMap[3]);
  var _WebUserMediaManager = require(_dependencyMap[4]);
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
  /* eslint-env browser */

  function getImageSize(videoWidth, videoHeight, scale) {
    const width = videoWidth * scale;
    const ratio = videoWidth / width;
    const height = videoHeight / ratio;
    return {
      width,
      height
    };
  }
  function toDataURL(canvas, imageType, quality) {
    const types = ['png', 'jpg'];
    (0, _invariant.default)(types.includes(imageType), `expo-camera: ${imageType} is not a valid ImageType. Expected a string from: ${types.join(', ')}`);
    const format = _WebConstants.ImageTypeFormat[imageType];
    if (imageType === 'jpg') {
      (0, _invariant.default)(quality <= 1 && quality >= 0, `expo-camera: ${quality} is not a valid image quality. Expected a number from 0...1`);
      return canvas.toDataURL(format, quality);
    } else {
      return canvas.toDataURL(format);
    }
  }
  function hasValidConstraints(preferredCameraType, width, height) {
    return preferredCameraType !== undefined && width !== undefined && height !== undefined;
  }
  function ensureCameraPictureOptions(config) {
    const captureOptions = {
      scale: 1,
      imageType: 'png',
      isImageMirror: false
    };
    for (const key in config) {
      if (key in config && config[key] !== undefined && key in captureOptions) {
        captureOptions[key] = config[key];
      }
    }
    return captureOptions;
  }
  const DEFAULT_QUALITY = 0.92;
  function captureImageData(video, pictureOptions = {}) {
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return null;
    }
    const canvas = captureImageContext(video, pictureOptions);
    const context = canvas.getContext('2d', {
      alpha: false
    });
    if (!context || !canvas.width || !canvas.height) {
      return null;
    }
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    return imageData;
  }
  function captureImageContext(video, {
    scale = 1,
    isImageMirror = false
  }) {
    const {
      videoWidth,
      videoHeight
    } = video;
    const {
      width,
      height
    } = getImageSize(videoWidth, videoHeight, scale);
    // Build the canvas size and draw the camera image to the context from video
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', {
      alpha: false
    });
    if (!context) {
      // Should never be called
      throw new Error('Context is not defined');
    }
    // sharp image details
    // context.imageSmoothingEnabled = false;
    // Flip horizontally (as css transform: rotateY(180deg))
    if (isImageMirror) {
      context.setTransform(-1, 0, 0, 1, canvas.width, 0);
    }
    context.drawImage(video, 0, 0, width, height);
    return canvas;
  }
  function captureImage(video, pictureOptions) {
    const config = ensureCameraPictureOptions(pictureOptions);
    const canvas = captureImageContext(video, config);
    const {
      imageType,
      quality = DEFAULT_QUALITY
    } = config;
    return toDataURL(canvas, imageType, quality);
  }
  function getSupportedConstraints() {
    if (navigator.mediaDevices && navigator.mediaDevices.getSupportedConstraints) {
      return navigator.mediaDevices.getSupportedConstraints();
    }
    return null;
  }
  function getIdealConstraints(preferredCameraType, width, height) {
    const preferredConstraints = {
      audio: false,
      video: {}
    };
    if (hasValidConstraints(preferredCameraType, width, height)) {
      return _WebConstants.MinimumConstraints;
    }
    const supports = getSupportedConstraints();
    // TODO(Bacon): Test this
    if (!supports || !supports.facingMode || !supports.width || !supports.height) {
      return _WebConstants.MinimumConstraints;
    }
    const types = ['front', 'back'];
    if (preferredCameraType && types.includes(preferredCameraType)) {
      const facingMode = _WebConstants.CameraTypeToFacingMode[preferredCameraType];
      if (isWebKit()) {
        const key = facingMode === 'user' ? 'exact' : 'ideal';
        preferredConstraints.video.facingMode = {
          [key]: facingMode
        };
      } else {
        preferredConstraints.video.facingMode = {
          ideal: _WebConstants.CameraTypeToFacingMode[preferredCameraType]
        };
      }
    }
    if (isMediaTrackConstraints(preferredConstraints.video)) {
      preferredConstraints.video.width = width;
      preferredConstraints.video.height = height;
    }
    return preferredConstraints;
  }
  function isMediaTrackConstraints(input) {
    return input && typeof input.video !== 'boolean';
  }
  /**
   * Invoke getStreamDevice a second time with the opposing camera type if the preferred type cannot be retrieved.
   *
   * @param preferredCameraType
   * @param preferredWidth
   * @param preferredHeight
   */
  async function getPreferredStreamDevice(preferredCameraType, preferredWidth, preferredHeight) {
    try {
      return await getStreamDevice(preferredCameraType, preferredWidth, preferredHeight);
    } catch (error) {
      // A hack on desktop browsers to ensure any camera is used.
      // eslint-disable-next-line no-undef
      if (error instanceof OverconstrainedError && error.constraint === 'facingMode') {
        const nextCameraType = preferredCameraType === 'back' ? 'front' : 'back';
        return await getStreamDevice(nextCameraType, preferredWidth, preferredHeight);
      }
      throw error;
    }
  }
  async function getStreamDevice(preferredCameraType, preferredWidth, preferredHeight) {
    const constraints = getIdealConstraints(preferredCameraType, preferredWidth, preferredHeight);
    const stream = await (0, _WebUserMediaManager.requestUserMediaAsync)(constraints);
    return stream;
  }
  function isWebKit() {
    return /WebKit/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
  }
  function compareStreams(a, b) {
    if (!a || !b) {
      return false;
    }
    const settingsA = a.getTracks()[0].getSettings();
    const settingsB = b.getTracks()[0].getSettings();
    return settingsA.deviceId === settingsB.deviceId;
  }
  function capture(video, settings, config) {
    const base64 = captureImage(video, config);
    const capturedPicture = {
      uri: base64,
      base64,
      width: 0,
      height: 0
    };
    if (settings) {
      const {
        width = 0,
        height = 0
      } = settings;
      capturedPicture.width = width;
      capturedPicture.height = height;
      capturedPicture.exif = settings;
    }
    if (config.onPictureSaved) {
      config.onPictureSaved(capturedPicture);
    }
    return capturedPicture;
  }
  async function syncTrackCapabilities(cameraType, stream, settings = {}) {
    if (stream?.getVideoTracks) {
      await Promise.all(stream.getVideoTracks().map(track => onCapabilitiesReady(cameraType, track, settings)));
    }
  }
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
  async function onCapabilitiesReady(cameraType, track, settings = {}) {
    if (typeof track.getCapabilities !== 'function') {
      return;
    }
    const capabilities = track.getCapabilities();
    // Create an empty object because if you set a constraint that isn't available an error will be thrown.
    const constraints = {};
    // TODO(Bacon): Add `pointsOfInterest` support
    const clampedValues = ['exposureCompensation', 'colorTemperature', 'iso', 'brightness', 'contrast', 'saturation', 'sharpness', 'focusDistance', 'zoom'];
    for (const property of clampedValues) {
      if (capabilities[property]) {
        constraints[property] = convertNormalizedSetting(capabilities[property], settings[property]);
      }
    }
    function validatedInternalConstrainedValue(constraintKey, settingsKey, converter) {
      const convertedSetting = converter(settings[settingsKey]);
      return validatedConstrainedValue({
        constraintKey,
        settingsKey,
        convertedSetting,
        capabilities,
        settings,
        cameraType
      });
    }
    if (capabilities.focusMode && settings.autoFocus !== undefined) {
      constraints.focusMode = validatedInternalConstrainedValue('focusMode', 'autoFocus', CapabilityUtils.convertAutoFocusJSONToNative);
    }
    if (capabilities.torch && settings.flashMode !== undefined) {
      constraints.torch = validatedInternalConstrainedValue('torch', 'flashMode', CapabilityUtils.convertFlashModeJSONToNative);
    }
    if (capabilities.whiteBalanceMode && settings.whiteBalance !== undefined) {
      constraints.whiteBalanceMode = validatedInternalConstrainedValue('whiteBalanceMode', 'whiteBalance', CapabilityUtils.convertWhiteBalanceJSONToNative);
    }
    try {
      await track.applyConstraints({
        advanced: [constraints]
      });
    } catch (error) {}
  }
  function stopMediaStream(stream) {
    if (!stream) {
      return;
    }
    if (stream.getAudioTracks) {
      stream.getAudioTracks().forEach(track => track.stop());
    }
    if (stream.getVideoTracks) {
      stream.getVideoTracks().forEach(track => track.stop());
    }
    if (isMediaStreamTrack(stream)) {
      stream.stop();
    }
  }
  function setVideoSource(video, stream) {
    const createObjectURL = window.URL.createObjectURL ?? window.webkitURL.createObjectURL;
    if (typeof video.srcObject !== 'undefined') {
      video.srcObject = stream;
    } else if (typeof video.mozSrcObject !== 'undefined') {
      video.mozSrcObject = stream;
    } else if (stream && createObjectURL) {
      video.src = createObjectURL(stream);
    }
    if (!stream) {
      const revokeObjectURL = window.URL.revokeObjectURL ?? window.webkitURL.revokeObjectURL;
      const source = video.src ?? video.srcObject ?? video.mozSrcObject;
      if (revokeObjectURL && typeof source === 'string') {
        revokeObjectURL(source);
      }
    }
  }
  function isCapabilityAvailable(video, keyName) {
    const stream = video.srcObject;
    if (stream instanceof MediaStream) {
      const videoTrack = stream.getVideoTracks()[0];
      return videoTrack.getCapabilities?.()?.[keyName];
    }
    return false;
  }
  function isMediaStreamTrack(input) {
    return typeof input.stop === 'function';
  }
  function convertNormalizedSetting(range, value) {
    if (!value) {
      return;
    }
    // convert the normalized incoming setting to the native camera zoom range
    const converted = convertRange(value, [range.min, range.max]);
    // clamp value so we don't get an error
    return Math.min(range.max, Math.max(range.min, converted));
  }
  function convertRange(value, r2, r1 = [0, 1]) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
  }
  function validatedConstrainedValue(props) {
    const {
      constraintKey,
      settingsKey,
      convertedSetting,
      capabilities,
      settings,
      cameraType
    } = props;
    const setting = settings[settingsKey];
    if (Array.isArray(capabilities[constraintKey]) && convertedSetting && !capabilities[constraintKey].includes(convertedSetting)) {
      return undefined;
    }
    return convertedSetting;
  }
},742,[33,516,743,744,739]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.convertAutoFocusJSONToNative = convertAutoFocusJSONToNative;
  exports.convertFlashModeJSONToNative = convertFlashModeJSONToNative;
  exports.convertWhiteBalanceJSONToNative = convertWhiteBalanceJSONToNative;
  /*
   * Native web camera (Android) has a torch: boolean
   */
  function convertFlashModeJSONToNative(input) {
    switch (input) {
      case 'torch':
        return true;
      case 'on':
      case 'off':
      case 'auto':
      default:
        return false;
    }
  }
  function convertWhiteBalanceJSONToNative(input) {
    switch (input) {
      case 'on':
      case 'auto':
        return 'continuous';
      case 'off':
        return 'none';
      case 'singleShot':
        return 'single-shot';
      default:
        return undefined;
    }
  }
  function convertAutoFocusJSONToNative(input) {
    switch (input) {
      case 'on':
      case 'auto':
        return 'continuous';
      case 'off':
        return 'manual';
      case 'singleShot':
        return 'single-shot';
      default:
        return undefined;
    }
  }
},743,[]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.VIDEO_ASPECT_RATIOS = exports.PictureSizes = exports.MinimumConstraints = exports.ImageTypeFormat = exports.FacingModeToCameraType = exports.CameraTypeToFacingMode = undefined;
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/aspectRatio
  const VIDEO_ASPECT_RATIOS = exports.VIDEO_ASPECT_RATIOS = {
    '3840x2160': 1.7777777777777777,
    '1920x1080': 1.7777777777777777,
    '1280x720': 1.7777777777777777,
    '640x480': 1.3333333333333333,
    '352x288': 1.2222222222222223
  };
  const PictureSizes = exports.PictureSizes = Object.keys(VIDEO_ASPECT_RATIOS);
  const ImageTypeFormat = exports.ImageTypeFormat = {
    jpg: 'image/jpeg',
    png: 'image/png'
  };
  const MinimumConstraints = exports.MinimumConstraints = {
    audio: false,
    video: true
  };
  const CameraTypeToFacingMode = exports.CameraTypeToFacingMode = {
    front: 'user',
    back: 'environment'
  };
  const FacingModeToCameraType = exports.FacingModeToCameraType = {
    user: 'front',
    environment: 'back'
  };
},744,[]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.useWebCameraStream = useWebCameraStream;
  var React = _interopRequireWildcard(require(_dependencyMap[0]));
  var Utils = _interopRequireWildcard(require(_dependencyMap[1]));
  var _WebConstants = require(_dependencyMap[2]);
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
  /* eslint-env browser */

  const VALID_SETTINGS_KEYS = ['autoFocus', 'flashMode', 'exposureCompensation', 'colorTemperature', 'iso', 'brightness', 'contrast', 'saturation', 'sharpness', 'focusDistance', 'whiteBalance', 'zoom'];
  function useLoadedVideo(video, onLoaded) {
    React.useEffect(() => {
      if (video) {
        video.addEventListener('loadedmetadata', () => {
          // without this async block the constraints aren't properly applied to the camera,
          // this means that if you were to turn on the torch and swap to the front camera,
          // then swap back to the rear camera the torch setting wouldn't be applied.
          requestAnimationFrame(() => {
            onLoaded();
          });
        });
      }
    }, [video]);
  }
  function useWebCameraStream(video, preferredType, settings, {
    onCameraReady,
    onMountError
  }) {
    const isStartingCamera = React.useRef(false);
    const activeStreams = React.useRef([]);
    const capabilities = React.useRef({
      autoFocus: 'continuous',
      flashMode: 'off',
      whiteBalance: 'continuous',
      zoom: 1
    });
    const [stream, setStream] = React.useState(null);
    const mediaTrackSettings = React.useMemo(() => {
      return stream ? stream.getTracks()[0].getSettings() : null;
    }, [stream]);
    // The actual camera type - this can be different from the incoming camera type.
    const type = React.useMemo(() => {
      if (!mediaTrackSettings) {
        return null;
      }
      // On desktop no value will be returned, in this case we should assume the cameraType is 'front'
      const {
        facingMode = 'user'
      } = mediaTrackSettings;
      return _WebConstants.FacingModeToCameraType[facingMode];
    }, [mediaTrackSettings]);
    const getStreamDeviceAsync = React.useCallback(async () => {
      try {
        return await Utils.getPreferredStreamDevice(preferredType);
      } catch (nativeEvent) {
        if (onMountError) {
          onMountError({
            nativeEvent
          });
        }
        return null;
      }
    }, [preferredType, onMountError]);
    const resumeAsync = React.useCallback(async () => {
      const nextStream = await getStreamDeviceAsync();
      if (Utils.compareStreams(nextStream, stream)) {
        // Do nothing if the streams are the same.
        // This happens when the device only supports one camera (i.e. desktop) and the mode was toggled between front/back while already active.
        // Without this check there is a screen flash while the video switches.
        return false;
      }
      // Save a history of all active streams (usually 2+) so we can close them later.
      // Keeping them open makes swapping camera types much faster.
      if (!activeStreams.current.some(value => value.id === nextStream?.id)) {
        activeStreams.current.push(nextStream);
      }
      // Set the new stream -> update the video, settings, and actual camera type.
      setStream(nextStream);
      if (onCameraReady) {
        onCameraReady();
      }
      return false;
    }, [getStreamDeviceAsync, setStream, onCameraReady, stream, activeStreams.current]);
    React.useEffect(() => {
      // Restart the camera and guard concurrent actions.
      if (isStartingCamera.current) {
        return;
      }
      isStartingCamera.current = true;
      resumeAsync().then(isStarting => {
        isStartingCamera.current = isStarting;
      }).catch(() => {
        // ensure the camera can be started again.
        isStartingCamera.current = false;
      });
    }, [preferredType]);
    // Update the native camera with any custom capabilities.
    React.useEffect(() => {
      const changes = {};
      for (const key of Object.keys(settings)) {
        if (!VALID_SETTINGS_KEYS.includes(key)) {
          continue;
        }
        const nextValue = settings[key];
        if (nextValue !== capabilities.current[key]) {
          changes[key] = nextValue;
        }
      }
      // Only update the native camera if changes were found
      const hasChanges = !!Object.keys(changes).length;
      const nextWebCameraSettings = Object.assign({}, capabilities.current, changes);
      if (hasChanges) {
        Utils.syncTrackCapabilities(preferredType, stream, changes);
      }
      capabilities.current = nextWebCameraSettings;
    }, [settings.autoFocus, settings.flashMode, settings.exposureCompensation, settings.colorTemperature, settings.iso, settings.brightness, settings.contrast, settings.saturation, settings.sharpness, settings.focusDistance, settings.whiteBalance, settings.zoom]);
    React.useEffect(() => {
      // set or unset the video source.
      if (!video.current) {
        return;
      }
      Utils.setVideoSource(video.current, stream);
    }, [video.current, stream]);
    React.useEffect(() => {
      return () => {
        // Clean up on dismount, this is important for making sure the camera light goes off when the component is removed.
        for (const stream of activeStreams.current) {
          // Close all open streams.
          Utils.stopMediaStream(stream);
        }
        if (video.current) {
          // Invalidate the video source.
          Utils.setVideoSource(video.current, stream);
        }
      };
    }, []);
    // Update props when the video loads.
    useLoadedVideo(video.current, () => {
      Utils.syncTrackCapabilities(preferredType, stream, capabilities.current);
    });
    return {
      type,
      mediaTrackSettings
    };
  }
},745,[15,742,744]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.useWebQRScanner = useWebQRScanner;
  var React = _interopRequireWildcard(require(_dependencyMap[0]));
  var _WebCameraUtils = require(_dependencyMap[1]);
  function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
  const qrWorkerMethod = ({
    data,
    width,
    height
  }) => {
    // eslint-disable-next-line no-undef
    const decoded = self.jsQR(data, width, height, {
      inversionAttempts: 'attemptBoth'
    });
    let parsed;
    try {
      parsed = JSON.parse(decoded);
    } catch {
      parsed = decoded;
    }
    if (parsed?.data) {
      const nativeEvent = {
        type: 'qr',
        data: parsed.data,
        cornerPoints: [],
        bounds: {
          origin: {
            x: 0,
            y: 0
          },
          size: {
            width: 0,
            height: 0
          }
        }
      };
      if (parsed.location) {
        nativeEvent.cornerPoints = [parsed.location.topLeftCorner, parsed.location.bottomLeftCorner, parsed.location.topRightCorner, parsed.location.bottomRightCorner];
      }
      return nativeEvent;
    }
    return parsed;
  };
  const createWorkerAsyncFunction = (fn, deps) => {
    const stringifiedFn = [`self.func = ${fn.toString()};`, 'self.onmessage = (e) => {', '  const result = self.func(e.data);', '  self.postMessage(result);', '};'];
    if (deps.length > 0) {
      stringifiedFn.unshift(`importScripts(${deps.map(dep => `'${dep}'`).join(', ')});`);
    }
    const blob = new Blob(stringifiedFn, {
      type: 'text/javascript'
    });
    const worker = new Worker(URL.createObjectURL(blob));
    // First-In First-Out queue of promises
    const promises = [];
    worker.onmessage = e => promises.shift()?.resolve(e.data);
    return data => {
      return new Promise((resolve, reject) => {
        promises.push({
          resolve,
          reject
        });
        worker.postMessage(data);
      });
    };
  };
  const decode = createWorkerAsyncFunction(qrWorkerMethod, ['https://cdn.jsdelivr.net/npm/jsqr@1.2.0/dist/jsQR.min.js']);
  function useWebQRScanner(video, {
    isEnabled,
    captureOptions,
    interval,
    onScanned,
    onError
  }) {
    const isRunning = React.useRef(false);
    const timeout = React.useRef(undefined);
    async function scanAsync() {
      // If interval is 0 then only scan once.
      if (!isRunning.current || !onScanned) {
        stop();
        return;
      }
      try {
        const data = (0, _WebCameraUtils.captureImageData)(video.current, captureOptions);
        if (data) {
          const nativeEvent = await decode(data);
          if (nativeEvent?.data) {
            onScanned({
              nativeEvent
            });
          }
        }
      } catch (error) {
        if (onError) {
          onError({
            nativeEvent: error
          });
        }
      } finally {
        // If interval is 0 then only scan once.
        if (interval === 0) {
          stop();
          return;
        }
        const intervalToUse = !interval || interval < 0 ? 16 : interval;
        // @ts-ignore: Type 'Timeout' is not assignable to type 'number'
        timeout.current = setTimeout(() => {
          scanAsync();
        }, intervalToUse);
      }
    }
    function stop() {
      isRunning.current = false;
      clearTimeout(timeout.current);
    }
    React.useEffect(() => {
      if (isEnabled) {
        isRunning.current = true;
        scanAsync();
      }
      return () => {
        if (isEnabled) {
          stop();
        }
      };
    }, [isEnabled]);
  }
},746,[15,742]);
__d(function (global, require, _$$_IMPORT_DEFAULT, _$$_IMPORT_ALL, module, exports, _dependencyMap) {
  var _interopRequireDefault = require(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ConversionTables = undefined;
  exports.convertNativeProps = convertNativeProps;
  exports.ensureNativeProps = ensureNativeProps;
  var _expoModulesCore = require(_dependencyMap[1]);
  var _ExpoCameraManager = _interopRequireDefault(require(_dependencyMap[2]));
  // Values under keys from this object will be transformed to native options
  const ConversionTables = exports.ConversionTables = {
    type: _ExpoCameraManager.default.Type,
    flash: _ExpoCameraManager.default.FlashMode
  };
  function convertNativeProps(props) {
    if (!props || typeof props !== 'object') {
      return {};
    }
    const nativeProps = {};
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'string' && ConversionTables[key]) {
        nativeProps[key] = ConversionTables[key][value];
      } else {
        nativeProps[key] = value;
      }
    }
    return nativeProps;
  }
  function ensureNativeProps(props) {
    const newProps = convertNativeProps(props);
    newProps.barcodeScannerEnabled = !!props?.onBarcodeScanned;
    newProps.flashMode = props?.flash ?? 'off';
    newProps.mute = props?.mute ?? false;
    newProps.autoFocus = props?.autofocus ?? 'off';
    return newProps;
  }
},747,[33,503,737]);