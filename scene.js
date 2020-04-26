import { Grid } from "./grid.js";
import { Camera } from "./camera.js"
import { Controls } from './controls.js';
import { RenderMeshBary } from "./rendermesh-bary.js";
import { makeCube } from './cube.js';
import { loadObjMesh } from './objloader.js';
import * as glMatrix from './gl-matrix/common.js';
import * as mat4 from "./gl-matrix/mat4.js";

/**
 * Represents the entire scene.
 */
export class Scene 
{
    /**
     * Constructs a Scene object.
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLElement} canvas the canvas element 
     */
    constructor(gl, canvas) 
    {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        // Variables used to store the model, view and projection matrices.
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();

        // Create the camera object and set to default position/orientation
        this.camera = new Camera();
        this.resetCamera();

        // The projection type 
        this.projType = "perspective";

        // The camera mode 
        this.mode = "mouse";

        // UI manager object
        this.controls = new Controls(this.canvas, this);
        
        // Create the meshes for the scene
        this.grid = new Grid(gl);   // The reference grid
        this.cube = new RenderMeshBary(gl, makeCube());

        //////////////
        // PART ONE //
        //////////////

        // Load the cow from an OBJ file.  Caution: the fetch method is 
        // asynchronous, so the mesh will not be immediately available.  
        // Make sure to check for null before rendering.  Use this as an example
        // to load other OBJ files.
        this.grass = null; 
        fetch('data/groundplane.obj')
            .then( (response) => {
                return response.text();
            })
            .then( (text) => {
                let objMesh = loadObjMesh(text);
                this.grass = new RenderMeshBary(gl, objMesh);
            });
        
        
        // Make a Cow!
        this.cow = null;
        fetch('data/spot_triangulated.obj')
            .then( (response) => {
                return response.text();
            })
            .then( (text) => {
                let objMesh = loadObjMesh(text);
                this.cow = new RenderMeshBary(gl, objMesh);
            });
        
        // Make an Eclipse! 
        this.eclipse = null;
        fetch('data/eclipse.obj')
            .then( (response) => {
                return response.text();
        })
        .then( (text) => {
            let objMesh = loadObjMesh(text);
            this.eclipse= new RenderMeshBary(gl, objMesh);
        });

        // Make a Bunny! 
        this.bunny = null;
        fetch('data/bunny_med.obj')
            .then( (response) => {
                return response.text();
        })
        .then( (text) => {
            let objMesh = loadObjMesh(text);
            this.bunny = new RenderMeshBary(gl, objMesh);
        });

        // Make a Blub!
        this.blub = null;
        fetch('data/blub_triangulated.obj')
            .then( (response) => {
                return response.text();
        })
        .then( (text) => {
            let objMesh = loadObjMesh(text);
            this.blub = new RenderMeshBary(gl, objMesh);
        });

        // Make a Bob!
        this.bob = null;
        fetch('data/bob_quad.obj')
            .then( (response) => {
                return response.text();
        })
        .then( (text) => {
            let objMesh = loadObjMesh(text);
            this.bob = new RenderMeshBary(gl, objMesh);
        });

        // Make a Spot!
        this.spot = null;
        fetch('data/spot_quadrangulated.obj')
            .then( (response) => {
                return response.text();
        })
        .then( (text) => {
            let objMesh = loadObjMesh(text);
            this.spot = new RenderMeshBary(gl, objMesh);
        });
    }

    /**
     * A convenience method to set all three matrices in the shader program.
     * Don't call this if you only need to set one or two matrices, instead,
     * just set it "manually" by calling gl.uniformMatrix4fv.
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {ShaderProgram} shader the shader 
     */
    setMatrices(gl, shader) 
    {
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
        gl.uniformMatrix4fv(shader.uniform('uView'), false, this.viewMatrix);
        gl.uniformMatrix4fv(shader.uniform('uProj'), false, this.projMatrix);
    }

    /**
     * Draw the Scene.  This method will be called repeatedly as often as possible.
     * 
     * @param {Number} time time in milliseconds
     * @param {WebGL2RenderingContext} gl 
     * @param {ShaderProgram} wireShader the shader to use when drawing meshes 
     * @param {ShaderProgram} flatShader the shader to use when drawing the Grid
     */
    render(time, gl, wireShader, flatShader) 
    {
        this.pollKeys();

        // Draw the objects using wireShader
        wireShader.use(gl);
        this.setMatrices(gl, wireShader);
        this.drawScene(gl, wireShader);

        // Draw the grid using flatShader
        flatShader.use(gl);
        this.setMatrices(gl, flatShader);
        this.grid.render(gl, flatShader);
    }   

    //////////////
    // PART TWO //  --> Need A, D, E, Q, S, W
    //////////////
    /**
     * Checks to see which keys are currently pressed, and updates the camera
     * based on the results.
     */
    pollKeys() 
    {
        // Only do this in "fly" mode.
        if( this.mode !== "fly" ) return;

        // TODO: Part 2
        // Use this.controls.keyDown() to determine which keys are pressed, and 
        // move the camera based on the results.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
        // for details on key codes.
        else 
        {
            // Key D (RIGHT)
            if (this.controls.keyDown("KeyD"))
            {
                this.camera.track(.05, 0);
                this.camera.getViewMatrix(this.viewMatrix);
            }
            
            // Key Q (UP)
            if (this.controls.keyDown("KeyQ"))
            { 
                this.camera.track(0, .05);
                this.camera.getViewMatrix(this.viewMatrix);

            }

            // Key A (LEFT)
            if (this.controls.keyDown("KeyA"))
            {
                this.camera.track(-.05, 0);
                this.camera.getViewMatrix(this.viewMatrix);
            }

            // Key E (DOWN)
            if (this.controls.keyDown("KeyE"))
            {
                this.camera.track(0, -.05);
                this.camera.getViewMatrix(this.viewMatrix);
            }

            // Key S (Zoom In)
            if (this.controls.keyDown("KeyS"))
            {
                this.camera.dolly(-.05);
                this.camera.getViewMatrix(this.viewMatrix);
            }

            // Key W (Zoom Out)
            if (this.controls.keyDown("KeyW"))
            {
                this.camera.dolly(.05); 
                this.camera.getViewMatrix(this.viewMatrix);
            }
        }
    }
    
    //////////////
    // PART ONE //
    //////////////
    /**
     * Draw the objects in the scene.
     * 
     * @param {WebGL2RenderingContext} gl
     * @param {ShaderProgram} shader the shader program
     */
    drawScene(gl, shader) 
    {
        // TODO: Part 1
        // The code below draws an example scene consisting of just one box and 
        // a cow.  This is intended as an example only.  Replace with a scene of
        // your own design!  If you want to use other meshes, load them in the constructor
        // above.  See the constructor for an example of how to load an OBJ file.

        // Set up the transformation
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [0.6, 0.51, 0.6]);
        mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, 0.5, 0.0]);

        // Set the model matrix in the shader
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);

        // Set the color
        gl.uniform3f( shader.uniform('uColor'), 0.8, 0.8, 0.0);

        // Draw the Grass
        if (this.grass !== null)
        {
            // Set up the grass transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [-1.5, 0.0, 0.0]);
           // mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI / -.27);
            mat4.scale(this.modelMatrix, this.modelMatrix, [2.0, 2.0, 2.4]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f( shader.uniform('uColor'), 0, 1.0, 0.498039);
            // Draw the grass
            this.grass.render(gl, shader);

        }
       
        // Draw the Cow
        if(this.cow !== null) 
        {
            // Set up the cow's transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [0.0, 0.23, 1.2]);
            mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI / -.27);
            mat4.scale(this.modelMatrix, this.modelMatrix, [0.3, 0.3, 0.3]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f( shader.uniform('uColor'), .30, .30, 1.00);
            // Draw the cow
            this.cow.render(gl, shader);

            // Draw another red cow 
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [.30, 0.23, .7]);
            mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI / -.27);
            mat4.scale(this.modelMatrix, this.modelMatrix, [0.3, 0.3, 0.3]);
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            //gl.uniform3f( shader.uniform('uColor'), .85, 0.85, 0.10);
            gl.uniform3f(shader.uniform('uColor'), 1, 0.43, 0.78);
            // Draw the 2nd cow
            this.cow.render(gl, shader);
        }

        // Draw the Eclipse 
        if (this.eclipse !== null)
        {
            // Set up the eclipse's transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [-1.0, 0.0, -1.0]);
            mat4.rotateY(this.modelMatrix, this.modelMatrix, Math.PI / 1.5);
            mat4.scale(this.modelMatrix, this.modelMatrix, [0.5, 0.5, 0.5]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f( shader.uniform('uColor'), 1.0, 1.0, 1.0);
            // Draw the eclipse
            this.eclipse.render(gl, shader);
        }
   
        // Draw the Bunny
        if (this.bunny !== null)
        {
            // Set up the bunny's transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [0.87, -0.13, 0]);
            mat4.rotate(this.modelMatrix, this.modelMatrix, -Math.PI / 2.0, [0, 1, 0]);
            mat4.scale(this.modelMatrix, this.modelMatrix, [4.0, 4.0, 4.0]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f(shader.uniform('uColor'), 1.0, 0, 0);
            // Draw the bunny
            this.bunny.render(gl, shader);
        }

        // Draw the Blub
        if (this.blub !== null)
        {
            // Set up the blub's transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [-1.0, 1.0, -1.0]);
           //mat4.translate(this.modelMatrix, this.modelMatrix, [0, .5, 0]);
            mat4.rotate(this.modelMatrix, this.modelMatrix, -Math.PI / 2.0, [0, 1, 0]);
            mat4.scale(this.modelMatrix, this.modelMatrix, [.2, .2, .2]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f(shader.uniform('uColor'), 0.89, 0.47, 0.20);
            // Draw the blub
            this.blub.render(gl, shader);
        }

        // Draw a Bob
        if (this.bob !== null)
        {
            // Set up the blub's transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [-1.4, 1.0, -.7]);
            mat4.rotate(this.modelMatrix, this.modelMatrix, -Math.PI / 0.9, [0, 1, 0]);
            mat4.scale(this.modelMatrix, this.modelMatrix, [.2, .2, .2]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f(shader.uniform('uColor'), 0.89, 0.47, 0.20);
            // Draw the blub
            this.bob.render(gl, shader);
        }

        // Draw a Spot 
        if (this.spot !== null)
        {
            // Set up the bunny's transformation
            mat4.identity(this.modelMatrix);
            mat4.translate(this.modelMatrix, this.modelMatrix, [0.55, 0.6, -2.9]);
            mat4.rotate(this.modelMatrix, this.modelMatrix, Math.PI / 1.30, [0, 1, 0]);
            mat4.scale(this.modelMatrix, this.modelMatrix, [0.8, 0.8, 0.8]);
            // Set the model matrix in the shader
            gl.uniformMatrix4fv(shader.uniform('uModel'), false, this.modelMatrix);
            // Set the color in the shader
            gl.uniform3f(shader.uniform('uColor'), 0.87, 0.58, 0.98);
            // Draw Spot
            this.spot.render(gl, shader);
        }

        // Reset the model matrix to the identity
        mat4.identity(this.modelMatrix);
    }

    /**
     * Called when the canvas is resized.
     * 
     * @param {WebGL2RenderingContext} gl 
     * @param {Number} width the width of the canvas in pixels 
     * @param {Number} height the height of the canvas in pixels 
     */
    resize(gl, width, height) 
    {
        this.width = width;
        this.height = height;
        this.setProjectionMatrix();

        // Sets the viewport transformation
        gl.viewport(0, 0, width, height);
    }

    ////////////////
    // PART THREE //
    ////////////////
    /**
     * Sets this.projMatrix to the appropriate projection matrix.
     */
    setProjectionMatrix() 
    {
        // TODO: Part 3
        // Set the projection matrix to the appropriate matrix based on this.projType.  
        // Currently, uses a perspective projection only.

        const aspect = this.width / this.height;
        if (this.projType === 'perspective')
        {
            mat4.perspective(this.projMatrix, glMatrix.toRadian(45.0), aspect, 0.5, 1000.0);
        }

        if (this.projType === 'orthographic')
        {
            mat4.ortho(this.projMatrix, -aspect, aspect, -1, 1, 0.5, 1000.0);

        }
    }

    ///////////             //////////
    // ORBIT //     OR     // TURN //
    ///////////            /////////
    /**
     * This method is called when the mouse moves while the left mouse button
     * is pressed. This should apply either a "orbit" motion to the camera
     * or a "turn" motion depending on this.mode.
     * 
     * @param {Number} deltaX change in the mouse's x coordinate
     * @param {Number} deltaY change in the mouse's y coordinate
     */
    leftDrag( deltaX, deltaY ) 
    { 
        // TODO: Part 2
        // Implement this method.

        deltaX = deltaX * .001;
        deltaY = deltaY * .001;

        // Mouse Mode = ORBIT
        if (this.mode === 'mouse')
        {  
            this.camera.orbit(deltaX, deltaY);
            this.camera.getViewMatrix(this.viewMatrix);
        } 

       // this.mode = "Fly";
        // Fly Mode = TURN 
        if (this.mode === 'fly')
        {
            this.camera.turn(deltaX, deltaY);
            this.camera.getViewMatrix(this.viewMatrix);
        }
    }

    ////////////
    // TRACK //
    ///////////
    /**
     * This method is called when the mouse moves while the left mouse button
     * is pressed and the shift key is down.  This should apply a "track" motion 
     * to the camera when in "mouse" mode.
     * 
     * @param {Number} deltaX change in the mouse's x coordinate
     * @param {Number} deltaY change in the mouse's y coordinate
     */
    shiftLeftDrag( deltaX, deltaY ) 
    {
        // TODO: Part 2
        // Implement this method
        
        if (this.mode === 'mouse')
        {
            // Update the Camera by getting the matrix 
            deltaX = deltaX * .001
            this.camera.track(deltaX, deltaY * .001); 

            // Update the view matrix in the shader 
            this.camera.getViewMatrix(this.viewMatrix);
        }

        else return; 
    }

    ////////////
    // DOLLY //
    ///////////
    /**
     * Called when the mouse wheel is turned.
     * 
     * @param {Number} delta change amount
     */
    mouseWheel(delta) 
    {
        // TODO: Part 2
        // Update the camera by applying a "dolly" motion.  The amount should be
        // proportional to delta.
        if (this.mode === 'mouse')
        {
            delta = delta * .001;
            this.camera.dolly(delta);
            this.camera.getViewMatrix(this.viewMatrix);
        }
        else return; 
    }

    /**
     * Resets the camera to a default position and orientation.  This is 
     * called when the user clicks the "Reset Camera" button.
     */
    resetCamera() 
    {
        // Set the camera's default position/orientation
        this.camera.orient([0,1,3], [0,0,0], [0,1,0]); // Modifies the camera
        // Retrieve the new view matrix
        this.camera.getViewMatrix(this.viewMatrix); // New view matrix 
    }

    /**
     * Set the view volume type.  This is called when the perspective/orthographic radio button
     * is changed.
     * 
     * @param {String} type projection type.  Either "perspective" or "orthographic" 
     */
    setViewVolume( type ) 
    {
        this.projType = type;
        this.setProjectionMatrix();
    }

    /**
     * Called when the camera mode is changed.
     * 
     * @param {String} type the camera mode: either "fly" or "mouse" 
     */
    setMode(type) 
    {
        this.mode = type;
    }
}