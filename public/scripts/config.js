
var config = new setup();

function setup() {

    this.getCount = getCount;
    this.getLandColor = getLandColor;
    this.getWaterColor = getWaterColor;
    this.getHatchTime = getHatchTime;
    this.getTotalLevels = getTotalLevels;
    this.generateLocations = generateLocations;
    this.getPoolSize = getPoolSize;

    var currentLevel = 1;
    var totalLevels = 10;

    var poolSizes;
    setupPoolSizes();

    //hex: 996633 converted to decimal * 100
    var landColor = new THREE.Vector3(60, 40, 20);

    bus.subscribe("levelChange", updateLevel);
    bus.subscribe("playerLoses", resetLevels);

    var levels = [];
    configLevel1();
    configLevel2();
    configLevel3();
    configLevel4();
    configLevel5();
    configLevel6();
    configLevel7();
    configLevel8();
    configLevel9();
    configLevel10();

    function setupPoolSizes() {
        poolSizes = getArray();
        poolSizes[componentType.duck] = 1;
        poolSizes[componentType.duckling] = 10;
        poolSizes[componentType.fox] = 10;
        poolSizes[componentType.croq] = 10;
        poolSizes[componentType.hawk] = 5;
        poolSizes[componentType.stick] = 12;
    }

    function getPoolSize(componentType) {
        return poolSizes[componentType];
    }

    function getTotalLevels() {
        return totalLevels;
    }

    function getArray() {

        var array = [];

        for (var i = 0; i < componentType.length; i++) {
            array[i].push(0);
        }

        return array;
    }

    function resetLevels() {
        currentLevel = 1;
    }

    function updateLevel() {
        currentLevel++;
    }

    function getRandomInRange(min, max) {
        var offset = getRandomInt(max - min);
        return min + offset;
    }

    function getCount(componentType) {
        var settings = levels[currentLevel - 1];
        var random = getRandomInRange(settings.min[componentType], settings.max[componentType]) - 1;
        //make sure we're not providing a count that's larger than our pool
        if (poolSizes[componentType] > 0) {
            return Math.min(random, poolSizes[componentType]);
        }
        else {
            return random;
        }
    }

    function getLandColor() {
        var red = getRandomInRange(landColor.x - 10, landColor.x + 10) / 100;
        var green = getRandomInRange(landColor.y - 8, landColor.y + 8) / 100;
        var blue = getRandomInRange(landColor.z - 5, landColor.z + 5) / 100;
        return new THREE.Color(red, green, blue);
    }
    function getWaterColor() {
        var green = getRandomInRange(20, 28) / 100;
        return new THREE.Color(0, green, 1);
    }

    function getHatchTime() {
        var settings = levels[currentLevel - 1];
        return getRandomInRange(settings.minHatchTime, settings.maxHatchTime);
    }

    function createBaseLevel() {
        level = {
            min: getArray(),
            max: getArray(),
            minHatchTime: 0,
            maxHatchTime: 0,
        }
        return level;
    }

    function generateLocations(count) {
        var locations = [];
        for (var i = 0; i < count; i++) {
            var x = getRandomInRange(5, 35);
            var y = getRandomInRange(5, 35);
            locations.push(new THREE.Vector2(x, y));
        }
        return locations;
    }

    function configLevel1() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel2() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel3() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 10;
        level.max[componentType.duckling] = 10;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        //level.minHatchTime = 5;
        //level.maxHatchTime = 15;
        level.minHatchTime = 999;
        level.maxHatchTime = 999;

        levels.push(level);
    }

    function configLevel4() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel5() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel6() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel7() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel8() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel9() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }

    function configLevel10() {

        var level = createBaseLevel();

        level.min[componentType.duckling] = 3;
        level.max[componentType.duckling] = 4;

        level.min[componentType.hawk] = 0;
        level.max[componentType.hawk] = 0;

        level.min[componentType.fox] = 1;
        level.max[componentType.fox] = 2;

        level.min[componentType.croq] = 3;
        level.max[componentType.croq] = 5;

        level.min[componentType.grass] = 4;
        level.max[componentType.grass] = 4;

        level.min[componentType.obstacle] = 4;
        level.max[componentType.obstacle] = 4;

        level.min[componentType.stick] = 12;
        level.max[componentType.stick] = 12;

        level.min[componentType.obstacle] = 60;
        level.max[componentType.obstacle] = 80;

        level.min[componentType.grass] = 60;
        level.max[componentType.grass] = 80;

        level.minHatchTime = 5;
        level.maxHatchTime = 15;

        levels.push(level);
    }
}