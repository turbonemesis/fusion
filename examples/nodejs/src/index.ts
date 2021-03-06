import { InjectProperty, InjectableClass, InjectableSingleton } from "@codecapers/fusion";

//
// Creates a type safe reference to a dependency.
//
export function createDependencyRef<T>(name: string): { T: T; id: string } {
	return {
		T: null!,
		id: name
	};
}
//
// Interface to the logging service.
//
interface ILog {
    info(msg: string): void;
}

//
// Extend the ILog namespace to create the dependency reference.
//
namespace ILog {
    export const ref = createDependencyRef<ILog>("ILog");
}

//
// This is a lazily injected singleton that's constructed just before it's injected.
//
@InjectableSingleton("ILog")
class Log implements ILog {
    info(msg: string): void {
        console.log(msg);
    }
}

@InjectableClass()
class MyClass {

    //
    // Injects the logging service into this property.
    //
    @InjectProperty(ILog.ref.id)
    log!: typeof ILog.ref.T;

    myFunction() {
        //
        // Use the injected logging service.
        // By the time we get to this code path the logging service has been automatically constructed and injected.
        //
        this.log.info("Hello world!");
    }
    
}

const myObject = new MyClass(); // The logging singleton is lazily created at this point.
myObject.myFunction();
